import { Global, Module } from '@nestjs/common';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { COM_ZEN_GRPC_NODEJS_OAUTH_SERVICE_PACKAGE_NAME } from './protos/interfaces/oauth';
import { GRPC_NAME } from 'src/common/constants/grpc-name.enum';

const retryOptions = {
  max_retries: 3, // Set the maximum number of retries
  initial_backoff_ms: 1000, // Initial backoff time in milliseconds
  max_backoff_ms: 5000, // Maximum backoff time in milliseconds
  backoff_multiplier: 1.5, // Backoff multiplier
  retryable_status_codes: [14], // Status codes to retry
};

const loader: GrpcOptions['options']['loader'] = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const keepalive: GrpcOptions['options']['keepalive'] = {
  keepaliveTimeMs: 5000,
  keepaliveTimeoutMs: 20000,
  keepalivePermitWithoutCalls: 1,
  ...(retryOptions && { retry: retryOptions }),
};

const channelOptions: GrpcOptions['options']['channelOptions'] = {
  'grpc.max_receive_message_length': 1024 * 1024 * 1024,
  'grpc.max_send_message_length': 1024 * 1024 * 100,
  grpcOptions: {
    'grpc.http2.max_frame_size': 1024 * 1024 * 10, // Set the maximum frame size if needed
  },
};

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: GRPC_NAME.GRPC_NODEJS_USER,
        transport: Transport.GRPC,
        options: {
          package: [COM_ZEN_GRPC_NODEJS_OAUTH_SERVICE_PACKAGE_NAME],
          protoPath: [join(__dirname, './protos/oauth.proto')],
          url: `${process.env.CONFIG_GRPC_NODEJS_USER_HOST}:${process.env.CONFIG_GRPC_NODEJS_USER_PORT}`,
          loader: loader,
          keepalive: keepalive,
          channelOptions: channelOptions,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcModule {}
