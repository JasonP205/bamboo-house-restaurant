import type { Socket } from "socket.io-client";

export interface SocketState {
  socket: Socket | null;
  connectSocketStaff: () => void;
  connectSocketCustomer: (tableId: string) => void;  
  disconnectSocket: () => void;
}
