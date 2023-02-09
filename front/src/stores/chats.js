import io from 'socket.io-client';
import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

import { useUserStore } from '@/stores/users';

export const useChats = defineStore('chats', () => {
  const socket = io(import.meta.env.VITE_API);

  const user = useUserStore();
  const showChat = ref(false);

  const chats = reactive({
    fromUserId: '',
    toUserId: '',
    message: '',
    messages: [],
    toUserName: '',
  });

  const addFromUserHandler = (item) => {
    chats.toUserId = item.id;
    chats.toUserName = item.name;
    showChat.value = true;
  };

  const sendMessageHandler = () => {
    chats.fromUserId = user.users._id;
    socket.emit('sendMessage', {
      fromUserId: chats.fromUserId,
      toUserId: chats.toUserId,
      message: chats.message,
    });
    chats.messages.push(chats.message);
    chats.message = '';
    getMessageHandler();
  };

  const getMessageHandler = () => {
    socket.emit('getMessage', {
      fromUserId: chats.fromUserId,
      toUserId: chats.toUserId,
    });
    socket.on('messages', (messages) => {
      console.log(messages, 'messages');
      chats.messages = messages;
    });
    socket.on('newMessage', (message) => {
      console.log(message, 'message');
      chats.messages.push(message);
    });
  };

  return {
    showChat,
    chats,
    addFromUserHandler,
    sendMessageHandler,
    getMessageHandler,
  };
});