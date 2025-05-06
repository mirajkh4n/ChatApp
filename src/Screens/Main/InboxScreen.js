import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import Header from '../../Component/Header';

const InboxScreen = ({route}) => {
  const {user} = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  const currentUser = auth().currentUser;
  const chatId = [currentUser.uid, user.uid].sort().join('_');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc') // Keep ascending order for correct timeline
      .onSnapshot(snapshot => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
        setLoading(false);
        
        // Scroll to bottom when new messages arrive
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({animated: true});
        }, 100);
      });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        flatListRef.current?.scrollToEnd({animated: true});
      }
    );
    
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add({
        text: text.trim(),
        senderId: currentUser.uid,
        receiverId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    setText('');
  };

  const renderItem = ({item}) => {
    const isSender = item.senderId === currentUser.uid;
    const formattedTime = item.createdAt?.seconds
      ? moment(item.createdAt.seconds * 1000).format('h:mm A')
      : '';

    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.sentMessage : styles.receivedMessage,
        ]}>
        <Text style={isSender ? styles.sentText : styles.receivedText}>
          {item.text}
        </Text>
        <Text style={isSender ? styles.sentTime : styles.receivedTime}>
          {formattedTime}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          {loading && (
            <ActivityIndicator
              size="large"
              color="#0084ff"
              style={styles.loading}
            />
          )}
          <View>
            <Header  title={user.username || user.email}/>
          </View>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No messages yet...</Text>
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.flatListContent}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={11}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({animated: true});
            }}
            onLayout={() => {
              flatListRef.current?.scrollToEnd({animated: true});
            }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              style={styles.input}
              multiline
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  flatListContent: {
    paddingBottom: 16,
    paddingTop: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
    marginHorizontal: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    borderBottomRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
    borderBottomLeftRadius: 0,
  },
  sentText: {
    color: '#fff',
    fontSize: 16,
  },
  receivedText: {
    color: '#000',
    fontSize: 16,
  },
  sentTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    textAlign: 'right',
  },
  receivedTime: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 5,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    fontSize: 16,
    maxHeight: 120,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#0084ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
});

export default InboxScreen;