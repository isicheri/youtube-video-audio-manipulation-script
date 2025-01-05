import ytdl from "@distube/ytdl-core";
import fs from "fs"
import ffmpeg from "fluent-ffmpeg";
import { FileFmt } from "./utils/utils";


ffmpeg.setFfmpegPath("C:\Users\OWNER\Downloads\ffmpeg-7.1-essentials_build\ffmpeg-7.1-essentials_build\bin\ffmpeg.exe");

export class YoutubManuScript {
    protected url: string;
 constructor(
url: string
 ) {
    this.url = url
 }

 async downloadVideo() {
    try {
        console.log("starting video download...")
        const info = await ytdl.getInfo(this.url);
        const title = info.videoDetails.title;
     console.log('Downloading:' + title);
       const filePath = `${title}.${FileFmt.MP4}`;
       const fileStream = fs.createWriteStream(filePath);
      const videoStream =  ytdl(url,{filter: "videoandaudio"}).pipe(fileStream);
      return new Promise((resolve, reject) => {
        fileStream.on('finish', () => {
            console.log("Video download completed!");
            resolve(filePath);
          });
        videoStream.on("error",(err) => {
            reject(`error:${err}`)
            videoStream.close()
        })
        fileStream.on('error', (err) => reject(`Error downloading video: ${err}`));
      })
       } catch (error) {
        console.log(error)
       }
 }

 async downloadAudio() {
    try {
        console.log("starting audio download...")
        const info = await ytdl.getInfo(this.url);
        const title = info.videoDetails.title;
     console.log('Downloading:' + title);
       const filePath = `${title}.${FileFmt.MP3}`;
       const fileStream = fs.createWriteStream(filePath);
      const audioStream =  ytdl(url,{filter: "audioonly"}).pipe(fileStream);
      return new Promise((resolve, reject) => {
        fileStream.on('finish', () => {
            console.log("audio download completed!");
            resolve(filePath);
          });
        audioStream.on("error",(err) => {
            reject(`error:${err}`)
            audioStream.close()
        })
        fileStream.on('error', (err) => reject(`Error downloading video: ${err}`));
      })
       } catch (error) {
        console.log(error)
       }
 }

 async downloadAudioAndManipulate(url:string,fmt:string,startTime:any,duration:any){
    try {
        const info = await ytdl.getBasicInfo(url);
        const title = info.videoDetails.title;
     console.log('Downloading:' + title);
     const filePath = `${title}.${fmt}`;
     ffmpeg()
     .input(ytdl(url,{filter:"audioonly"}))//get your audio stream
     .audioCodec('libmp3lame') //set audio codec to MP3
     .audioBitrate(192)// set the bitrate
     .setStartTime(startTime) // Set the start time for audio extracton
     .setDuration(duration)
     .audioFilters('volume=2.0') //this sets the volume
     .output(filePath)
     .on('start',(cl) => {console.log('ffmpeg process started:',cl)})
     .on('progress',(progress) => {console.log(`processing:${progress.percent}`)})
     .on('end',() => {console.log(`ffmpeg process started:${filePath}`)})
     .on("error",(err) => {console.log(`error during the process:`,err)})
     .run()

     } catch (error) {
     console.log(error)
     }
} 

}
//got the idea from an upwork project to manipulate audio to download a specific time frame(starting time frame and ending time frame)
//also change the url to the video you want to use 
const url = "https://youtu.be/A3Q_KXySvCY?si=mt3fRqNSQ1zOqhfa";
// downloadAudioAndManipulate(url,'mp3',"00:02:00","00:04:30")
const x = new YoutubManuScript(url).downloadVideo();
// const y = new YoutubManuScript(url).downloadAudio();
// const z = new YoutubManuScript(url).downloadAudioAndManipulate(url,"mp3","00:02:00","00:04:30")


// you can substitute the value of x for y,z
 Promise.resolve(x).then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err)
})