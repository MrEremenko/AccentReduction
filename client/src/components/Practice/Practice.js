import {  useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRandomSentence, uploadSentence } from '../../actions/practiceActions';
import mic from './mic.svg';
import toWav from 'audiobuffer-to-wav';

const Practice = () => {
  const dispatch = useDispatch();
  const [recording, setRecording] = useState(false);
  const sentence = useSelector(state => state.practice.sentence);
  const isLoading = useSelector(state => state.practice.uploadingSentence);

  const appendHeader = (blob, cb) => {
    //Use http://soundfile.sapp.org/doc/WaveFormat/
    let headerSize = 44;  //44 bytes
    console.log(blob);
    console.log(blob.size);
    let totalSize = headerSize + blob.size;
    let buffer = new ArrayBuffer(headerSize);

    //Some constants
    const SAMPLE_RATE = 44100;
    const NUM_CHANNELS = 1;
    const BITS_PER_SAMPLE = 16;
    
    //RIFF chunk descriptor
    let ChunkID = new Uint32Array(buffer, 0, 1);
    let ChunkSize = new Uint32Array(buffer, 4, 1);
    let Format = new Uint32Array(buffer, 8, 1);

    //The "fmt" sub-chunk
    let Subchunk1ID = new Uint32Array(buffer, 12, 1);
    let Subchunk1Size = new Uint32Array(buffer, 16, 1);
    let AudioFormat = new Uint8Array(buffer, 20, 2);
    let NumChannels = new Uint8Array(buffer, 22, 2);
    let SampleRate = new Uint32Array(buffer, 24, 1);
    let ByteRate = new Uint32Array(buffer, 28, 1);
    let BlockAlign = new Uint16Array(buffer, 32, 1);
    let BitsPerSample = new Uint16Array(buffer, 34, 1);
    
    //The "data" sub-chunk
    let Subchunk2ID = new Uint32Array(buffer, 36, 1);
    let Subchunk2Size = new Uint32Array(buffer, 40, 1);

    //Start the Riff chunk
    // ChunkID[0] = 0x52494646 ;  //RIFF in hexadecimal
    new DataView(buffer).setInt32(0, 0x52494646, false);
    //console.log("ChunkId:", ChunkID);
    
    ChunkSize[0] = totalSize - 8;   //set the size
    //console.log("ChunkSize:", ChunkSize);

    Format[0] = 0x57415645;
    //console.log("Format:", Format);

    //Now start the "fmt" subchunk
    Subchunk1ID[0] = 0x666d7420;
    //console.log("Subchunk1ID:", Format);

    Subchunk1Size[0] = 0x10000000;
    //console.log("Subchunk1Size:", Subchunk1Size);

    AudioFormat[0] = 1;
    //console.log("AudioFormat:", AudioFormat);

    NumChannels[0] = 1;
    //console.log("NumChannels:", NumChannels);

    SampleRate[0] = 44100;
    //console.log("SampleRate:", SampleRate);
    
    ByteRate[0] = SAMPLE_RATE * NUM_CHANNELS * BITS_PER_SAMPLE / 8;
    //console.log("ByteRate:", ByteRate);
    
    BlockAlign[0] = NUM_CHANNELS * BITS_PER_SAMPLE / 8;
    //console.log("BlockAlign:", BlockAlign);
    
    BitsPerSample[0] = BITS_PER_SAMPLE;
    //console.log("BitsPerSample:", BitsPerSample);

    //Now the "data" sub chunk
    Subchunk2ID[0] = 0x64617461;
    //console.log("Subchunk2ID:", Subchunk2ID);
    
    Subchunk2Size[0] = blob.size;
    
    //Final print out
    let all = new Uint8Array(buffer).buffer;
    console.log("Final:", all);

    //Ok, now add in the actual data from the blob, and create a new blob, replacing the old one
    //CAUTION: can change to FileReader.readAsArrayBuffer() if compatability is a problem...
    // let audioFileBuffer = await blob.arrayBuffer();
    var audioFileBuffer;
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
        audioFileBuffer = event.target.result;
        let audioBuf = new Uint8Array(audioFileBuffer);
        cb(new Blob([buffer, audioBuf], { type:'audio/wav' }));
    };
    fileReader.readAsArrayBuffer(blob);

    //ok, now create the new blob
    // let arr = await blob.arrayBuffer();
    // let ok = new Uint8Array(arr);
    // console.log("Test:", ok);
  }
  

  const notRecordingFunction = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      // console.log(MediaRecorder.isTypeSupported('audio/webm;codecs=pcm'));
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      const recordingMic = document.getElementById("recordingMic");
      
      setRecording(true);
      console.log(mediaRecorder);
      mediaRecorder.start();
      
      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks);
        var formData = new FormData();
        var audioContext = new (window.AudioContext || window.webkitAudioContext)()
        audioContext.decodeAudioData(await audioBlob.arrayBuffer(), (buffer) => {
          let okWhat = toWav(buffer);
          let result = new Blob([new DataView(okWhat)], { type: "audio/wav" });
          formData.append('sentence', result);
          dispatch(uploadSentence({ formData, audioFile: result, sentence }));
          
        });
        
        // appendHeader(audioBlob, function(result) {
        // });
      });
      
      
      recordingMic.onclick = function () {
        mediaRecorder.stop();
        setRecording(false);
      };
    });
  }

  useEffect(() => {
    dispatch(getRandomSentence());
  }, [])

  return (
    <div style={{ height: "100%" }}>
      <div style={{ height: "30vh", backgroundImage: "linear-gradient(#A5D4FF, #FFFFFF)", display: "flex", alignItems: "center", flexDirection: "column-reverse" }}>
        <div style={{ fontSize: "4vh", textAlign: "center" }}>
        Read the following:
        </div>
      </div>
      <div style={{ height: "70vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: "Cinzel", fontSize: "5vh", color: "#292929", margin: "5vh 0vh", textAlign: "center" }}>{sentence}</div>
        <img id="notRecordingMic" src={mic} style={{ display: recording ? "none" : "block", borderStyle: "solid", borderRadius: "10vh", height: "10vh", width: "10vh", 
            cursor: "pointer", borderColor: "black" }} onClick={e => notRecordingFunction()}/>
        <img id="recordingMic" src={mic} style={{ display: !recording ? "none" : "block", borderStyle: "solid", borderRadius: "10vh", height: "10vh", width: "10vh", 
            cursor: "pointer", borderColor: "red" }}/>
        {isLoading && <div style={{ margin: "auto" }} className="loader"></div>}
      </div>
    </div>
  );
}

export default Practice;