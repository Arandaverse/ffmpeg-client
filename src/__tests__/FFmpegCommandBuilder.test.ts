import { FFmpegCommandBuilder } from "../FFmpegCommandBuilder";

describe("FFmpegCommandBuilder", () => {
  it("should build a basic command", () => {
    const command = new FFmpegCommandBuilder()
      .input(
        "https://storage.googleapis.com/ffmpeg-api-test-bucket/user_1/input/test.mp4"
      )
      .output("output.mp4")
      .build();

    expect(command).toEqual({
      ffmpeg_command: "-i {{in1}} {{out1}}",
      input_files: {
        in1: "https://storage.googleapis.com/ffmpeg-api-test-bucket/user_1/input/test.mp4",
      },
      output_files: {
        out1: "output.mp4",
      },
    });
  });

  it("should build a complex command", () => {
    const command = new FFmpegCommandBuilder()
      .input(
        "https://storage.googleapis.com/ffmpeg-api-test-bucket/user_1/input/test.mp4"
      )
      .setVideoCodec("libx264")
      .setAudioCodec("aac")
      .setVideoBitrate("1000k")
      .setAudioBitrate("128k")
      .setSize("1280x720")
      .setFPS(30)
      .output("output.mp4")
      .build();

    expect(command).toEqual({
      ffmpeg_command:
        "-i {{in1}} -c:v libx264 -c:a aac -b:v 1000k -b:a 128k -s 1280x720 -r 30 {{out1}}",
      input_files: {
        in1: "https://storage.googleapis.com/ffmpeg-api-test-bucket/user_1/input/test.mp4",
      },
      output_files: {
        out1: "output.mp4",
      },
    });
  });
});
