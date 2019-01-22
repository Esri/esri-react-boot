// Imports //
import React, { Component } from 'react';
import styled from 'styled-components';
import { Paper, AppBar, Card, CardContent, Typography } from '@material-ui/core';

import { theme } from '../styles/theme';

// Styled Components //
const Container = styled.div`
    position: absolute;
    bottom: 65px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 5em;
`;

const StyledPaper = styled(Paper)`
    width: 80vw;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const StyledAppBar = styled(AppBar)`
    flex-direction: row;
    align-items: flex-start;
    padding: 10px 25px;
    background-color: ${theme.palette.background.header.main};
    border-radius: ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0;
    box-shadow: none;
    border-bottom: 3px solid ${theme.palette.background.header.dark};
    color: ${theme.palette.text.primary};
    font-weight:
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 25px;
`;

// Class //
class CardPanel extends Component {
    constructor(props) {
        super(props);
        this.state = { RTL: false }
    }

    render() {
        return (
            <Container>
                <StyledPaper elevation={1}>
                    <StyledAppBar position="static">
                        <Typography variant="subtitle1">
                            Incidents
                        </Typography>
                    </StyledAppBar>

                    <Row>
                        <Card>
                            <CardContent>
                                This is a card...
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                This is a card...
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                This is a card...
                            </CardContent>
                        </Card>
                    </Row>
                </StyledPaper>
            </Container>
        )
    }
}

export default CardPanel
