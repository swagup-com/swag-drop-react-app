import { Grid } from "@mui/material";
import { useOktaAuth } from "@okta/okta-react";
import React from "react";
import StylessButton from "./buttons";
import CenteredGrid from "./CenteredGrid";

const HeaderWrapper = ({ component, emptyState }) => {
const Content = component;
const { oktaAuth } = useOktaAuth();
    return (
        <div style={{ height: '100vh' }}>
            <div style={{ backgroundColor: 'white' }}>
                <CenteredGrid>
                    <Grid container style={{ height: 42, paddingTop: 4, paddingBottom: 4 }}>
                        <Grid item xs>
                            <a href="/">
                                <img src="/images/public/su-logo.svg" alt="logo" style={{ objectFit: 'contain', height: '100%',  maxWidth: 224}}/>
                            </a>
                        </Grid>
                        <Grid  item><StylessButton onClick={() => oktaAuth.signOut('/')}>Logoout</StylessButton></Grid>
                    </Grid>
                </CenteredGrid>
            </div>
            <div style={{ height: 24 }} />
            <Content emptyState={emptyState}/>
        </div>
    );
};

export default HeaderWrapper;