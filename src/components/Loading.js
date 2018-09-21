// Imports //
import React, { Component } from 'react';
import styled, { keyframes, injectGlobal } from 'styled-components';

import {ProgressSpinner} from 'primereact/progressspinner';

import background from '../styles/images/TopoDesignOne.jpg';

// Animation durations in millisecondss -- Change these to adjust animation
const delayAmount = 1000;
const durationAmount = 1000;
// Animation calculations
const animationPeriod = delayAmount + durationAmount;
const animationDelay = delayAmount + 'ms';
const animationDuration = durationAmount + 'ms';

// Styled Components //
injectGlobal`
    .p-progress-spinner-svg {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 100%;
    }
`;

const fadeOut = keyframes`
    0%   {opacity: 1;}
    100% {opacity: 0;}
`;

const Container = styled.div`
    position: absolute;
    z-index: 10;
    height: 100%;
    width: 100%;
    background: url(${background}) no-repeat center/cover;
`;

const FadingContainer = styled(Container)`
    animation-name: ${fadeOut};
    animation-duration: ${props => props.delay};
    animation-timing-function: ease-in-out;
    animation-delay: ${props => props.duration};
`;

const SpinWrap = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
`;

// Class //
class Loading extends Component {
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
                    <SpinWrap>
                        <ProgressSpinner/>
                    </SpinWrap>
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

export default Loading
