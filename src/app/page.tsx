"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { ModeToggle } from "@/components/toggle";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { FlipHorizontal } from "lucide-react";
type Props = {};

export default function Home(props: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [mirror, setMirror] = useState<boolean>(false);
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
        <div className="border-primary/5 border-2 rounded max-w-xs flex flex-col w-auto text-center gap-2 justify-between shadow">
          {/* top section */}
          <div className="flex flex-col gap-2 p-4">
            <ModeToggle />
            <Button variant={"outline"} size={"icon"}>
              <FlipHorizontal />
            </Button>
            <Separator />
          </div>
          {/*middle section */}
          <div className="flex flex-col gap-2">
            <h1> hello</h1>

            <Separator />
          </div>
          {/* last section */}
          <div className="flex flex-col gap-2">
            <h1> hello</h1>
            <Separator />
          </div>
        </div>
      </div>
    </main>
  );
}
