import React, {useState, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Images} from '../../Assets/Images';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState({});
  const [users, setUsers] = useState([]);

  const currentUser = auth().currentUser?.uid;

  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const snapshot = await firestore().collection('users').get();
      const allUsers = snapshot.docs
        .map(doc => doc.data())
        .filter(user => user.uid !== currentUser)
        .map(user => ({
          ...user,
          chatInfo: chats[user.uid] || null, 
        }));

      setUsers(allUsers);
    };

    fetchUsers();
  }, [chats, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
  
    const chatsRef = database().ref('chats');
  
    const unsubscribe = chatsRef.on('value', async snapshot => {
      const data = snapshot.val() || {};
      const lastMessageMap = {};
  
      for (let chatId in data) {
        const chat = data[chatId];
        if (chat?.users?.[currentUser]) {
          const otherUserId = Object.keys(chat.users).find(
            uid => uid !== currentUser,
          );
          lastMessageMap[otherUserId] = {
            timestamp: chat.timestamp,
            lastMessage: chat.lastMessage || '',
          };
        }
      }
  
      setChats(lastMessageMap);
  
      // ✅ Fetch users *after* chat data is ready
      const snapshotUsers = await firestore().collection('users').get();
      const allUsers = snapshotUsers.docs
        .map(doc => doc.data())
        .filter(user => user.uid !== currentUser)
        .map(user => ({
          ...user,
          chatInfo: lastMessageMap[user.uid] || null,
        }));
  
      setUsers(allUsers);
    });
  
    return () => chatsRef.off('value', unsubscribe);
  }, [currentUser]);
  

  const formatTime = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.uid}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Inbox', {user: item})}>
            <Image
              source={
                item.photoURL && item.photoURL.trim() !== ''
                  ? {uri: item.photoURL}
                  : Images.dummyPic
              }
              style={styles.profileImage}
            />
            <View style={styles.chatInfo}>
              <View style={styles.row}>
                <Text style={styles.username}>
                  {item.username || item.email}
                </Text>
                <Text style={styles.timeText}>
                  {formatTime(item.chatInfo?.timestamp)}
                </Text>
              </View>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.chatInfo?.lastMessage || ''}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={{color: '#777'}}>No chats available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor:'red'
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
});

export default ChatScreen;
