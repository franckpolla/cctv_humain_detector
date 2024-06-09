"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { ModeToggle } from "@/components/toggle";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Camera,
  FlipHorizontal,
  MoonIcon,
  SunIcon,
  Video,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Slider } from "@/components/ui/slider";
import Beep from "@/util/audio";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as CocoSsd from "@tensorflow-models/coco-ssd";
import { ObjectDetection, DetectedObject } from "@tensorflow-models/coco-ssd";

import Loading from "./loading";
import { drawOnCanvas } from "@/util/draw";


type Props = {};

export default function Home(props: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [mirror, setMirror] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [screenShort, SetscreenShort] = useState<boolean>(false);
  const [autoRecording, setAutoRecording] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [model, setModel] = useState<ObjectDetection>();
  const [loading, setLoading] = useState<boolean>(false);

  let interval: any = null;
  const userPromptRecoding = () => {
    return setRecording((prev: any) => !prev);
  };

  const userPromptSScreenshort = (prev: any) => {
    return SetscreenShort((prev: any) => !prev);
  };

  const userPromptAutoRecording = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setAutoRecording(!autoRecording);
    return (
      <>
        {autoRecording
          ? toast("Recording has ended", {
              description: formattedDate,
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          : toast("Recording has started", {
              description: formattedDate,
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })}
      </>
    );
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  function toggleAutoRecord(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }
  useEffect(() => {
    try {
      setLoading(true);
      initModel();
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    if (model) {
      setLoading(false);
    }
  }, [model]);

  async function initModel() {
    const loadModel: ObjectDetection = await CocoSsd.load({
      base: "mobilenet_v2",
    });
    setModel(loadModel);
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    interval = setInterval(() => {
      runPrediction();
    }, 100);

    return () => clearInterval(interval);
  }, [webcamRef.current, model]);

  async function runPrediction() {
    if (
      model &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const predictions:DetectedObject = await model.detect(webcamRef.current.video);
    resizeCanvas(canvasRef,webcamRef)
    drawOnCanvas(mirror,predictions, canvasRef.current?.getContext("2d"))
    }
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">
          {" "}
          <Loading />
        </div>
      ) : (
        <div>
          <main className="flex p-4 w-full">
            {/* left division of the webcam and canvas*/}
            <div className="relative w-full ">
              <div className="relative h-screen w-full">
                <Webcam
                  ref={webcamRef}
                  mirrored={mirror} // display horizontally where (right or left ) you are looking
                  className="w-full h-full object-contain p-2"
                />
                <canvas
                  ref={canvasRef}
                  className="top-0 left-0 h-full w-full absolute"
                />{" "}
                {/*The <canvas> element is an HTML element used for rendering graphics, animations, games, data visualizations, and other interactive content on a web page. It provides a drawable area that can be manipulated using JavaScript and various APIs like the CanvasRenderingContext2D or WebGL.*/}
              </div>
            </div>
            {/* the right division of the webcam */}
            <div>
              <div className="flex flex-row flex-1">
                <div className="border-primary/5 border-2  items-center  rounded max-w-xs flex flex-col w-auto text-center gap-2 justify-between shadow">
                  {/* top section */}
                  <div className="flex flex-col gap-2 p-4">
                    <ModeToggle />
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => {
                        setMirror((prev) => !prev);
                      }}
                    >
                      <FlipHorizontal />
                    </Button>
                    <Separator className="my-2" />
                  </div>
                  {/*middle section */}
                  <div className="flex flex-col gap-2">
                    <Separator className="my-2" />
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={userPromptSScreenshort}
                    >
                      <Camera />
                    </Button>
                    <Button
                      variant={recording ? "destructive" : "outline"}
                      size={"icon"}
                      onClick={userPromptRecoding}
                    >
                      <Video />
                    </Button>
                    <Button
                      variant={autoRecording ? "destructive" : "outline"}
                      className={
                        autoRecording ? "bg-red-600  animate-pulse" : ""
                      }
                      size={"icon"}
                      onClick={userPromptAutoRecording}
                    >
                      <Video />
                    </Button>
                  </div>
                  {/* last section */}
                  <div className="flex flex-col gap-2 pb-4">
                    <Separator className="my-2" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} size={"icon"}>
                          <Volume2 />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Slider
                          defaultValue={[volume]}
                          max={1}
                          min={0}
                          step={0.2}
                          onValueCommit={(val) => {
                            setVolume(val[0]);
                            Beep(val[0]);
                          }}
                          className={cn(
                            "w-64 right-4",
                            "rounded border bg-popover m-2 p-2 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 "
                          )}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className=" wiki h-full flex-1 px-2 overflow-y-scroll">
                  <div className="text-xs text-muted-foreground">
                    <ul className="space-y-4">
                      <li>
                        <strong>Dark Mode/Sys Theme 🌗</strong>
                        <p>Toggle between dark mode and system theme.</p>
                        <Button
                          className="my-2 h-6 w-6"
                          variant={"outline"}
                          size={"icon"}
                        >
                          <SunIcon size={14} />
                        </Button>{" "}
                        /{" "}
                        <Button
                          className="my-2 h-6 w-6"
                          variant={"outline"}
                          size={"icon"}
                        >
                          <MoonIcon size={14} />
                        </Button>
                      </li>
                      <li>
                        <strong>Horizontal Flip ↔️</strong>
                        <p>Adjust horizontal orientation.</p>
                        <Button
                          className="h-6 w-6 my-2"
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => {
                            setMirror((prev: any) => !prev);
                          }}
                        >
                          <FlipHorizontal size={14} />
                        </Button>
                      </li>
                      <Separator />
                      <li>
                        <strong>Take Pictures 📸</strong>
                        <p>
                          Capture snapshots at any moment from the video feed.
                        </p>
                        <Button
                          className="h-6 w-6 my-2"
                          variant={"outline"}
                          size={"icon"}
                          onClick={userPromptSScreenshort}
                        >
                          <Camera size={14} />
                        </Button>
                      </li>
                      <li>
                        <strong>Manual Video Recording 📽️</strong>
                        <p>Manually record video clips as needed.</p>
                        <Button
                          className="h-6 w-6 my-2"
                          variant={recording ? "destructive" : "outline"}
                          size={"icon"}
                          onClick={userPromptRecoding}
                        >
                          <Video size={14} />
                        </Button>
                      </li>
                      <Separator />
                      <li>
                        <strong>Enable/Disable Auto Record 🚫</strong>
                        <p>
                          Option to enable/disable automatic video recording
                          whenever required.
                        </p>
                        <Button
                          className="h-6 w-6 my-2"
                          variant={autoRecording ? "destructive" : "outline"}
                          size={"icon"}
                          onClick={toggleAutoRecord}
                        >
                          <Video size={14} />
                        </Button>
                      </li>

                      <li>
                        <strong>Volume Slider 🔊</strong>
                        <p>Adjust the volume level of the notifications.</p>
                      </li>
                      <li>
                        <strong>Camera Feed Highlighting 🎨</strong>
                        <p>
                          Highlights persons in{" "}
                          <span style={{ color: "#FF0F0F" }}>red</span> and
                          other objects in{" "}
                          <span style={{ color: "#00B612" }}>green</span>.
                        </p>
                      </li>
                      <Separator />
                      <li className="space-y-4">
                        <strong>Share your thoughts 💬 </strong>
                        <br />
                        <br />
                        <br />
                      </li>
                    </ul>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
function resizeCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, webcamRef: React.RefObject<Webcam>) {
  const canvas= canvasRef.current;
  const video =webcamRef.current?.video
  if (canvas && video) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
}

