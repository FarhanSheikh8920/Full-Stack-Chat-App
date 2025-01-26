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
        const { authUser } = useAuthStore.getState();
    
        socket.on("newMessage", (newMessage) => {
          const { senderId, receiverId } = newMessage;

    // Only accept messages involving the current user and selected user
    const isRelevantMessage =
      (senderId === selectedUser._id && receiverId === authUser._id) || // Message sent to the current user
      (senderId === authUser._id && receiverId === selectedUser._id);   // Message sent by the current user

    if (!isRelevantMessage) {
      return; // Ignore irrelevant messages
    }

    
          set({
            messages: [...get().messages, newMessage],
          });
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
