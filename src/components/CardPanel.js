// Imports //
import React, { Component } from 'react';
import styled from 'styled-components';
import { Paper, AppBar, Card, CardContent } from '@material-ui/core';

// Styled Components //
const Container = styled.div`
    position: absolute;
    bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 5em;
`;

const StyledPaper = styled(Paper)`
    width: 85%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const StyledAppBar = styled(AppBar)`
    flex-direction: row;
    align-items: flex-start;
    padding: 10px;
    background-color: #eff0f2;
    border-radius: 4px 4px 0 0;
    box-shadow: none;
    border-bottom: 3px solid #dadce0;
    color: #4d4d4d;
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
                        Incidents
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
