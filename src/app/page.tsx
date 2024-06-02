"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { ModeToggle } from "@/components/toggle";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, Video, Volume2 } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Slider } from "@/components/ui/slider";

type Props = {};

export default function Home(props: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [mirror, setMirror] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [screenShort, SetscreenShort] = useState<boolean>(false);
  const [autoRecording, setAutoRecording] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);

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
  return (
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
              className={autoRecording ? "bg-red-600  animate-pulse" : ""}
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
              <PopoverTrigger>
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
                  onValueCommit={(val)=> {setVolume (val[0])   
                  beep(val[0]);            
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </main>
  );
}
