import { Grid } from "@mui/material";
import React from "react";
import CenteredGrid from "./CenteredGrid";

const HeaderWrapper = ({ component }) => {
const Content = component;
    return (
        <div style={{ height: '100vh' }}>
            <div style={{ backgroundColor: 'white' }}>
                <CenteredGrid>
                    <Grid container style={{ height: 56 }}>
                        <Grid item >
                            <img src="/images/public/swagup-logo.png" alt="logo" style={{ objectFit: 'contain', height: '100%',  maxWidth: 224}}/>
                        </Grid>
                    </Grid>
                </CenteredGrid>
            </div>
            <div style={{ height: 24 }} />
            <Content />
        </div>
    );
};

export default HeaderWrapper;