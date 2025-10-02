import asyncio
import websockets
import json
import os
import sys

class WebSocketTester:
    def __init__(self, server_url="ws://localhost:8000/api/v1/ws/live-meeting"):
        self.server_url = server_url
        self.websocket = None

    async def connect(self):
        """Connects to the WebSocket server."""
        try:
            self.websocket = await websockets.connect(self.server_url)
            print(f"✅ Connected to {self.server_url}")
            return True
        except Exception as e:
            print(f"❌ Failed to connect: {e}")
            return False

    async def send_json(self, data: dict):
        """Sends a JSON object to the server."""
        try:
            await self.websocket.send(json.dumps(data))
            print(f"📤 Sent JSON: {data}")
            return True
        except Exception as e:
            print(f"❌ Error sending JSON: {e}")
            return False

    async def send_audio_file(self, file_path):
        """Streams an audio file to the server in binary chunks."""
        if not os.path.exists(file_path):
            print(f"❌ Audio file not found: {file_path}")
            return False
        
        try:
            with open(file_path, 'rb') as f:
                audio_data = f.read()
            
            print(f"📁 Streaming audio file: {file_path} ({len(audio_data)} bytes)")
            
            chunk_size = 4096  # 4KB chunks
            for i in range(0, len(audio_data), chunk_size):
                await self.websocket.send(audio_data[i:i + chunk_size])
                await asyncio.sleep(0.02)  # Simulate real-time streaming
            
            print("✅ Audio file sent successfully")
            return True
            
        except Exception as e:
            print(f"❌ Error sending audio file: {e}")
            return False

    async def listen_for_results(self, timeout=60):
        """Waits for a broadcasted result from the server."""
        print("👂 Listening for results...")
        try:
            message = await asyncio.wait_for(self.websocket.recv(), timeout=timeout)
            data = json.loads(message)
            
            print("\n" + "="*50)
            print("📋 BROADCAST RESULTS RECEIVED:")
            print("="*50)
            print(f"📝 Transcript: {data.get('full_transcript', 'N/A')}")
            print(f"📊 Summary: {data.get('full_summary', 'N/A')}")
            print("="*50)
            
            return data
            
        except asyncio.TimeoutError:
            print(f"⏰ Timeout after {timeout} seconds waiting for results")
            return None
        except websockets.exceptions.ConnectionClosed as e:
            print(f"🔌 Connection closed by server: {e.reason} (Code: {e.code})")
            return None
        except Exception as e:
            print(f"❌ Error receiving results: {e}")
            return None

    async def close(self):
        """Closes the WebSocket connection."""
        if self.websocket and self.websocket.open:
            await self.websocket.close()
            print("🔌 Connection closed")

async def test_recorder_flow(audio_file_path):
    """
    Tests the complete flow: starts a listener, then a recorder, sends audio,
    and confirms the listener receives the broadcast.
    """
    recorder = WebSocketTester()
    listener = WebSocketTester()

    print("\n--- Starting Integrated Recorder & Listener Test ---")
    
    # 1. Start the listener first to ensure it's ready for the broadcast
    if not await listener.connect():
        return
    await listener.send_json({"role": "listener"})
    print("🎧 Listener is connected and waiting for broadcasts.")
    
    # Run the listener in the background
    listener_task = asyncio.create_task(listener.listen_for_results())

    # 2. Give the server a moment, then connect the recorder
    await asyncio.sleep(1)
    if not await recorder.connect():
        await listener.close()
        return

    try:
        # 3. Declare role as recorder and provide a title
        await recorder.send_json({"role": "recorder", "title": f"Test for {os.path.basename(audio_file_path)}"})

        # 4. Send the audio file
        if await recorder.send_audio_file(audio_file_path):
            # 5. Send the end signal (as a JSON object)
            await recorder.send_json({"text": "__END__"})
            
            # 6. Wait for the listener task to complete (i.e., it received the broadcast)
            await listener_task
        
    except Exception as e:
        print(f"❌ Test failed during recorder flow: {e}")
    finally:
        await recorder.close()
        await listener.close()
        print("\n--- Test Finished ---")

async def test_listener_only_flow():
    """Tests the listener flow by connecting and passively waiting for broadcasts."""
    listener = WebSocketTester()
    
    if not await listener.connect():
        return
    
    try:
        # 1. Declare role as listener
        await listener.send_json({"role": "listener"})
        
        print("\n🎧 Listener is active. Waiting for broadcasts...")
        print("   -> To test, run the recorder in another terminal:")
        print(f"   -> python {os.path.basename(sys.argv[0])} recorder <audio_file>")
        print("   (Press Ctrl+C to stop listening)")

        while True:
            # Wait indefinitely for results
            results = await listener.listen_for_results(timeout=None)
            if results is None:
                print("Listener connection was closed.")
                break
                
    except KeyboardInterrupt:
        print("\n⏹️  Stopped by user")
    except Exception as e:
        print(f"❌ Listener test failed: {e}")
    finally:
        await listener.close()

async def create_sample_audio():
    """Creates a sample WAV file for testing if pydub is installed."""
    try:
        from pydub import AudioSegment
        from pydub.generators import Sine
        
        filename = "test_sample.wav"
        if not os.path.exists(filename):
            print(f"🎵 Creating sample audio file: {filename}")
            # Generate a 5-second 440Hz tone
            Sine(440).to_audio_segment(duration=5000).export(filename, format="wav")
        return filename
        
    except ImportError:
        print("\n⚠️  pydub is not installed. Run 'pip install pydub' to create a sample audio file.")
        return None

def print_usage():
    script_name = os.path.basename(sys.argv[0])
    print("\n" + "="*60)
    print("🧪 WebSocket Audio Transcription Tester (v2 for Role-Based Server)")
    print("="*60)
    print("Usage:")
    print(f"  python {script_name} recorder <audio_file_path>")
    print(f"  python {script_name} listener")
    print(f"  python {script_name} create-sample")
    print("\nModes:")
    print("  recorder:  Runs a full end-to-end test. It simulates BOTH a listener")
    print("             and a recorder to verify the broadcast mechanism.")
    print("  listener:  Connects as a passive listener only. Use this to watch for")
    print("             broadcasts from your Chrome extension or another test.")
    print("="*60)

async def main():
    if len(sys.argv) < 2:
        print_usage()
        return
    
    command = sys.argv[1].lower()
    
    if command == "recorder":
        if len(sys.argv) < 3:
            print("❌ Audio file path is required for recorder mode.")
            print_usage()
            return
        audio_file = sys.argv[2]
        if not os.path.exists(audio_file):
            print(f"❌ File not found: {audio_file}")
            return
        await test_recorder_flow(audio_file)
        
    elif command == "listener":
        await test_listener_only_flow()
        
    elif command == "create-sample":
        sample_file = await create_sample_audio()
        if sample_file:
            print(f"✅ Sample created: {sample_file}")
            print(f"💡 Now you can run: python {sys.argv[0]} recorder {sample_file}")
        
    else:
        print(f"❌ Unknown command: '{command}'")
        print_usage()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")