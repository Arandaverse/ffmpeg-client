# FFmpeg Command Generator

A TypeScript library for building and executing FFmpeg commands through a remote FFmpeg service. This package provides a simple and intuitive interface for video processing tasks.

## Features

- Fluent API for building FFmpeg commands
- Support for common video processing operations
- Job status monitoring and progress tracking
- TypeScript support with full type definitions
- Promise-based async/await interface

## Installation

```bash
npm install ffmpeg-command-generator
```

## Quick Start

```typescript
import { FFMPEGClient } from "ffmpeg-command-generator";

// Initialize the client
const client = new FFMPEGClient(
  "https://your-ffmpeg-service.com",
  "your-api-token"
);

// Create and execute a command
const response = await client
  .createCommand()
  .input("input.mp4")
  .output("output.mp4")
  .setVideoCodec("h264")
  .setAudioCodec("aac")
  .setVideoBitrate("1M")
  .setSize("1280x720")
  .setFPS(30)
  .execute();

// Monitor job status
const status = await client.getJobStatus(response.uuid);
console.log(status);
```

## API Reference

### FFMPEGClient

The main client class for interacting with the FFmpeg service.

```typescript
const client = new FFMPEGClient(baseUrl: string, apiToken: string);
```

### FFmpegCommandBuilder

A fluent interface for building FFmpeg commands.

Methods:

- `input(path: string)`: Set input file path
- `output(path: string)`: Set output file path
- `setVideoCodec(codec: string)`: Set video codec
- `setAudioCodec(codec: string)`: Set audio codec
- `setVideoBitrate(bitrate: string)`: Set video bitrate
- `setAudioBitrate(bitrate: string)`: Set audio bitrate
- `setSize(size: string)`: Set output dimensions
- `setFPS(fps: number)`: Set frames per second
- `addOption(option: string)`: Add custom FFmpeg option
- `execute()`: Execute the command
- `executeAndWait(pollInterval?: number, timeout?: number)`: Execute and wait for completion

### Job Status

The job status response includes:

- `uuid`: Unique job identifier
- `status`: Current status (pending/processing/completed/failed)
- `progress`: Progress percentage
- `error`: Error message (if failed)
- `output_files`: Metadata for processed files

## Error Handling

The library uses standard Promise rejection for error handling. Always wrap API calls in try/catch blocks:

```typescript
try {
  const response = await client
    .createCommand()
    .input("input.mp4")
    .output("output.mp4")
    .execute();
} catch (error) {
  console.error("FFmpeg command failed:", error);
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
