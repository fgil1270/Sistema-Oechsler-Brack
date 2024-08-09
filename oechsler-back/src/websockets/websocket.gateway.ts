import { 
    WebSocketGateway, 
    WebSocketServer, 
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    MessageBody,
    SubscribeMessage
} from '@nestjs/websockets';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@ApiTags('Websocket')
@WebSocketGateway({
    //http://${process.env.API_CLIENT_HOST}:${process.env.API_CLIENT_PORT}`
    cors: {
        origin: '*', //'http://localhost:4200' URL de tu aplicación Angular
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private configService: ConfigService) {}

    private loggedInUsersCount = 0;

    @ApiOperation({ summary: 'Contador de usuarios conectados' })
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