import { 
    WebSocketGateway, 
    WebSocketServer, 
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    MessageBody,
    SubscribeMessage
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:4200', // URL de tu aplicación Angular
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private loggedInUsersCount = 0;

    handleConnection(client: Socket) {
        this.loggedInUsersCount++;
        this.server.emit('users_count', this.loggedInUsersCount);
    }

    handleDisconnect(client: Socket) {
        this.loggedInUsersCount--;
        this.server.emit('users_count', this.loggedInUsersCount);
    }

    @SubscribeMessage('loggin')
    handleMessages(@MessageBody() data: any){
        
        this.server.emit('loggin', data);
    }
   
}