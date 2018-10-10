// Imports //
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { theme } from '../styles/theme';

import background from '../styles/images/Topo-Abs-BG.svg';
import logo from '../styles/images/Esri-React-Logo.svg';

// Animation durations in millisecondss -- Change these to adjust animation
const delayAmount = 1000;
const durationAmount = 1000;
// Animation calculations
const animationPeriod = delayAmount + durationAmount;
const animationDelay = delayAmount + 'ms';
const animationDuration = durationAmount + 'ms';

// Styled Components //
const fadeOut = keyframes`
    0%   {opacity: 1;}
    100% {opacity: 0;}
`;

const Container = styled.div`
    position: absolute;
    z-index: 10;
    height: 100%;
    width: 100%;
    background: rgba(255,255,255,0.1) url(${background}) no-repeat center/cover;
    background-blend-mode: screen;
`;

const FadingContainer = styled(Container)`
    animation-name: ${fadeOut};
    animation-duration: ${props => props.delay};
    animation-timing-function: ease-in-out;
    animation-delay: ${props => props.duration};
`;

const Wrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
`;

const StyledCircularProgress = withStyles({
    root: {
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '100%',
        padding: '10px',
    },
    circle: {
        padding: '10px',
        fill: 'rgba(0,0,0,0.5)',
        stroke: `${theme.palette.common.white}`
    }
})(CircularProgress);

const Title = styled.div `
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

const TitleH1 = styled.h1 `
    font-size: 3em;
    text-shadow: -2px 2px 8px rgba(0,0,0,0.25);
`;

const Logo = styled.img `
    width: 5em;
    height: 100%;
    margin-right: 1em;
`;

// Class //
class LoadScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { isAnimating: true }
    }

    // Run animation timer
    playAnimation = () => {
        setTimeout(() => {
            this.setState({
                isAnimating: false
            })
        }, animationPeriod);
    }

    render() {
        if (!this.props.isLoading && this.state.isAnimating) {
            return (
                <Container>
                    <Wrapper>
                        <StyledCircularProgress
                            size={75}
                            thickness={2}
                        />
                    </Wrapper>
                    <Title>
                        <Logo src={logo}></Logo>
                        <TitleH1>Esri-React-Boot</TitleH1>
                    </Title>
                </Container>
            )
        } else if (this.props.isLoading && this.state.isAnimating) {
            this.playAnimation();
            return (
                <FadingContainer delay={animationDelay} duration={animationDuration}/>
            )
        } else {
            return null
        }
    }
}

export default LoadScreen
