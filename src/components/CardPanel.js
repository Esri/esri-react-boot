// Imports //
import React, { Component } from 'react';
import styled from 'styled-components';

import {Panel} from 'primereact/panel';
import {Card} from 'primereact/card';

// Styled Components //
const CardContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

// Class //
class CardPanel extends Component {
    constructor(props) {
        super(props);
        this.state = { RTL: false }
    }

    render() {
        return(
            <Panel>
                <CardContainer>
                    <Card title="Simple Card" style={{width: '360px'}}>
                            <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                                quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                            </div>
                    </Card>
                    <Card title="Simple Card" style={{width: '360px'}}>
                            <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                                quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                            </div>
                    </Card>
                    <Card title="Simple Card" style={{width: '360px'}}>
                            <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                                quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                            </div>
                    </Card>
                </CardContainer>
            </Panel>
        )
    }
}

export default CardPanel
