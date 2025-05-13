// --- Imports ---
import React from 'react';
import { Paper, useTheme } from '@mui/material';

// --- Component Definition ---
const PaperWrapper = ({ children }) => {
    // --- Hooks ---
    const theme = useTheme();

    // --- Render ---
    return (
        <Paper
            elevation={2}
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                overflow: 'hidden',
            }}
        >
            {children}
        </Paper>
    );
};

export default PaperWrapper;