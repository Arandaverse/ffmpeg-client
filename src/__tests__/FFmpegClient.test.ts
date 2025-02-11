import { FFMPEGClient } from "../FFmpegClient";

describe("FFMPEGClient", () => {
  let client: FFMPEGClient;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    client = new FFMPEGClient("http://api.example.com", "test-api-token");
  });

  it("should execute a command and return job UUID", async () => {
    const mockResponse = { uuid: "123", status: "pending" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await client
      .createCommand()
      .input(
        "https://storage.googleapis.com/ffmpeg-api-test-bucket/user_1/input/test.mp4"
      )
      .output("output.mp4")
      .execute();

    expect(response).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith("http://api.example.com/ffmpeg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Token": "test-api-token",
      },
      body: JSON.stringify({
        ffmpeg_command: "-i {{in1}} {{out1}}",
        input_files: {
          in1: "https://storage.googleapis.com/ffmpeg-api-test-bucket/user_1/input/test.mp4",
        },
        output_files: {
          out1: "output.mp4",
        },
      }),
    });
  });

  it("should check job status", async () => {
    const mockStatus = {
      uuid: "123",
      status: "completed",
      progress: 100,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:01:00Z",
      output_files: {
        "{{out1}}": {
          file_format: "mp4",
          file_id: "456",
          file_type: "video",
          height: 720,
          size_mbytes: 10,
          storage_url: "https://example.com/output.mp4",
          width: 1280,
        },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStatus),
    });

    const status = await client.getJobStatus("123");
    expect(status).toEqual(mockStatus);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://api.example.com/ffmpeg/progress/123",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Token": "test-api-token",
        },
      }
    );
  });

  it("should execute and wait for completion", async () => {
    const mockResponse = { uuid: "123", status: "pending" };
    const mockStatus = {
      uuid: "123",
      status: "completed",
      progress: 100,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:01:00Z",
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStatus),
      });

    const result = await client
      .createCommand()
      .input("input.mp4")
      .output("output.mp4")
      .executeAndWait(100); // Use shorter poll interval for test

    expect(result).toEqual(mockStatus);
  });
});
