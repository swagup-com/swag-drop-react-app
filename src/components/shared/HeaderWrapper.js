import { Grid } from "@mui/material";
import React from "react";
import CenteredGrid from "./CenteredGrid";

const HeaderWrapper = ({ component, emptyState }) => {
const Content = component;
    return (
        <div style={{ height: '100vh' }}>
            <div style={{ backgroundColor: 'white' }}>
                <CenteredGrid>
                    <Grid container style={{ height: 42, paddingTop: 4, paddingBottom: 4 }}>
                        <Grid item >
                            <a href="/">
                                <img src="/images/public/su-logo.svg" alt="logo" style={{ objectFit: 'contain', height: '100%',  maxWidth: 224}}/>
                            </a>
                        </Grid>
                    </Grid>
                </CenteredGrid>
            </div>
            <div style={{ height: 24 }} />
            <Content emptyState={emptyState}/>
        </div>
    );
};

export default HeaderWrapper;