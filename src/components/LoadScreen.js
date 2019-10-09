// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

// React
import React from "react";

// Components
import Loader from "calcite-react/Loader";
import background from "../styles/images/Topo-Abs-BG.svg";
import logo from "../styles/images/Esri-React-Logo.svg";

// Styled & Motion Components
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.1) url(${background}) no-repeat center/cover;
  background-blend-mode: screen;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
`;

const Title = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 2em;
  text-align: right;
  color: white;
`;

const Label = styled.h1`
  font-size: 3em;
  text-shadow: -2px 2px 8px rgba(0, 0, 0, 0.25);
`;

const Logo = styled.img`
  width: 5em;
  height: 100%;
  margin-right: 1em;
`;

const FadingContainer = () => (
  <motion.div
    initial={{ opacity: 1, zIndex: 1000 }}
    animate={{
      opacity: 0,
      transitionEnd: {
        display: "none"
      }
    }}
    transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
  >
    <Container></Container>
  </motion.div>
);

const LoadScreen = props => {
  if (!props.isLoading) {
    return (
      <Container>
        <Wrapper>
          <Loader />
        </Wrapper>
        <Title>
          <Logo src={logo}></Logo>
          <Label>Esri-React-Boot</Label>
        </Title>
      </Container>
    );
  }

  return <FadingContainer />;
};

export default LoadScreen;
