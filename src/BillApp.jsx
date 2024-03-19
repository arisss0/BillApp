import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import logo from '../src/billLogo.png';
import axios from 'axios';
import { AppBar, Box, Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, TextField, Toolbar, Typography } from '@mui/material';

const useStyles = makeStyles({
    paper: {
        '& .MuiPaper-root':{
            width: '600px'
        }
    },
    imageStyle: {
        marginTop: '10px',
        borderRadius: '10px',
        marginRight: '8px',
        height: '100px'
    },
    margin: {
        marginTop: '10px'
    },
    cardStyle: {
        marginBottom: '10px',
        backgroundColor: '#f0f0f0',
    },
    cardContentStyle: {
        paddingBottom: '8px',
    }
});

const BillApp = () => {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bills, setBills] = useState([]);

    const categories = [
        { id: 7000, label: 'Water' },
        { id: 2640, label: 'Garden Maintenance' },
        { id: 2530, label: 'Heating' },
        { id: 5635, label: 'Cleaning' }
    ];

    const handleFilterClick = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleSearch = async () => {
        const url = `https://bills-test-api.valuedriven.io/api/v1/bills/?from=${fromDate}&to=${toDate}&categories=${selectedCategories.join(',')}`;
        try {
            const response = await axios.get(url);
            if (response.data && Array.isArray(response.data.bills)) {
                setBills(response.data.bills);
            } else {
                console.error('Invalid data format returned from the API:', response.data);
            }
            setOpenDialog(false);
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    const handleFilterChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <img src={logo} alt="billFinder" className={classes.imageStyle} />
                    </Typography>
                    <Button color='inherit' variant="outlined" sx={{ mr: 2, p: 1.5 }} onClick={handleFilterClick}>
                        <FilterAltIcon />
                    </Button>
                </Toolbar>
            </AppBar>
            <Dialog open={openDialog} onClose={handleDialogClose} className={classes.paper}>
                <DialogTitle>Filter Bills</DialogTitle>
                <DialogContent>
                    <Box mt={3}>
                    <TextField
                        label="From"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    </Box>
                    <Box mt={3}>
                    <TextField
                        label="To"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    </Box>
                    <FormControl fullWidth sx={{ margin: '20px 0px' }}>
                        <InputLabel>Select Categories</InputLabel>
                        <Select
                            multiple
                            value={selectedCategories}
                            onChange={handleFilterChange}
                            input={<Input />}
                            renderValue={(selected) => selected.map(categoryId => categories.find(category => category.id === categoryId)?.label).join(', ')}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    <FormControlLabel
                                        control={<Checkbox checked={selectedCategories.indexOf(category.id) > -1} />}
                                        label={category.label}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                    Cancel
                    </Button>
                    <Button onClick={handleSearch} color="primary">
                    Search
                    </Button>
                </DialogActions>
            </Dialog>
            <>
                {bills.map((bill) => (
                    <Card key={bill.id}  variant="outlined">
                        <CardContent className={classes.cardContentStyle}>
                            <Typography variant="h5" component="h2">{bill.description}</Typography>
                            <Typography color="textSecondary">Issue Date: {bill.issue_date}</Typography>
                            <Typography color="textSecondary">Category: {bill.category.label}</Typography>
                            <Typography color="textSecondary">Amount: {bill.amount}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </>
        </>
    );
};

export default BillApp;