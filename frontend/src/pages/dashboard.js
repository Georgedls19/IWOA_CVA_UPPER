import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

const DashboardCards = ({ cards }) => {
    return (
        <Grid container spacing={3} justifyContent="center">
            {cards.map((card) => (
                <Grid item xs={12} sm={1} md={2} key={card.id}>
                    <Card
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            backgroundColor: '#f5f5f5',
                            boxShadow: 3,
                            transition: 'transform 0.2s',
                            marginTop: '2rem',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                backgroundColor: '#e3f2fd',
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {card.title}
                            </Typography>
                            <Typography variant="body1">
                                {card.content}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};


export default DashboardCards;
