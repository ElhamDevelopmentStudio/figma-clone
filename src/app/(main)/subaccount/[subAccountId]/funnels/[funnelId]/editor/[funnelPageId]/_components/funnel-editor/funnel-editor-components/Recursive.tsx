import { EditorElement } from "@/providers/editor/editor-provider";
import React from "react";
import TextComponent from "./Text";
import Container from "./Container";
import VideoComponent from "./Video";
import LinkComponent from "./LinkComponent";
import TwoColumns from "./TwoColumns";
import ContactFormComponent from "./ContactFormComponent";
import Checkout from "./Checkout";
import ImageComponent from "./ImageComponent";
import ThreeColumns from "./ThreeColumns";
import Section from "./Section";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "__body":
      return <Container element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "contactForm":
      return <ContactFormComponent element={element} />;
    case "paymentForm":
      return <Checkout element={element} />;
    case "2Col":
      return <TwoColumns element={element} />;
    case "image":
      return <ImageComponent element={element} />;
    case "link":
      return <LinkComponent element={element} />;
    case "3Col":
      return <ThreeColumns element={element} />;
    case "section":
      return <Section element={element} />;
    default:
      return null;
  }
};

export default Recursive;
