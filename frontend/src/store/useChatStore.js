import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../store/useAuthStore'
export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoarding: false,
    isMessageLoarding: false,

    getUsers: async () => {
        set({ isUserLoarding: true });
        try {
            const res = await axiosInstance.get("/message/user");
            set({ users: res.data });

        } catch (error) {
            console.log("error in getting user:", error);
        } finally {
            set({ isUserLoarding: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessageLoarding: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ message: res.data });

        } catch (error) {
            console.log("error in getting message:", error);
        } finally {
            set({ isMessageLoarding: false });
        }

    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
      
        const socket = useAuthStore.getState().socket;
        if (!socket) {
          console.warn("Socket not initialized");
          return;
        }
      
        // Remove any existing listener to avoid duplication
        socket.off("newMessage");
      
        // Add a new listener
        socket.on("newMessage", (newMessage) => {
        //  const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
          if (newMessage.senderId !== selectedUser._id) return;
      
          // Safely update the state
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));
        });
      },
      
        unsubcribeFromMessages: () => {
            const socket= useAuthStore.getState().socket;
            socket.off("newMessage");
        },






    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    }



}))
