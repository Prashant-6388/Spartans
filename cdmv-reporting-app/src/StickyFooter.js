import React from "react";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const footerStyle = {
    backgroundColor: "rgba(226, 135, 10, 0.18)",
    color: "#212121",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "5px",
    position: "fixed",
    left: "0",
    bottom: "0",    
    width: "100%"
};

const phantomStyle = {
    display: "block",
    padding: "5px",
    height: "30px",
    width: "100%"
};

function Copyright() {
    return (
        <Typography variant="body2" color="textPrimary" style={{ fontWeight: "bold", fontSize: '11px' }}>
            {'Copyright © '}
            <Link color="inherit" href="https://www.ups.com/">
                UPS
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function StickyFooter() {
    return (
        <div>
            <div style={phantomStyle} />
            <div style={footerStyle}>
                <Copyright />
            </div>

        </div>
    );
}