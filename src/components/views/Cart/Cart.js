import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';

import { connect } from 'react-redux';
import { getAll } from '../../../redux/plantsRedux';
import { getCart, changeValue, changeSelectValue } from '../../../redux/cartRedux';


import styles from './Cart.module.scss';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 550,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 80,
  },
}));

function createData(name, colors, price, quantity, total, id) {
  return { name, colors, price, quantity, total, id };
}

class Component extends React.Component {

  render(){
    const {className, classes, plantsInCart, changeValue, changeSelectValue} = this.props;

    const rows = plantsInCart ? plantsInCart.map(plant => createData(plant.polishName, plant.colors, plant.price, plant.value, plant.value?plant.price*plant.value:plant.price*0, plant.id)) : [];

    const changeSelect = (event, id) => {
      event.preventDefault();
      changeSelectValue({id, choosenColor: event.target.value});
    };

    const changeInput = (event, id) => {
      event.preventDefault();
      changeValue({id, value: parseInt(event.target.value)});
    };

    const totalPrice = () => {
      let sum = [];
      rows.map(row => row.total ? sum.push(row.total) : sum.push(0));
      const total = sum.reduce((a, b) => a + b, 0); //get sum of array elements
      return total;
    };
    
    return(
      <div className={clsx(className, styles.root)}>
        <Container maxWidth="sm" className={clsx(className, styles.root)}>
          <Paper elevation={0} >
            <h2>Koszyk</h2>
            <TableContainer component={Paper}>
              <Table 
                className={classes.table} 
                size="small" 
                aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Roślina</TableCell>
                    <TableCell align="right">Kolor kwiatów</TableCell>
                    <TableCell align="right">Cena (PLN)</TableCell>
                    <TableCell align="right">Ilość</TableCell>
                    <TableCell align="right">Cena całkowita (PLN)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <FormControl 
                          className={classes.formControl}
                        >
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={row.colors}
                            // onChange={handleChange}
                            onChange={e => changeSelect(e, row.id)}

                          >
                            {row.colors.map(choosenColor => 
                              <MenuItem key={choosenColor} value={choosenColor}>
                                {choosenColor}
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                      <TableCell align="right">
                        <input 
                          type="number" 
                          min="1" 
                          max="10" 
                          value={row.quantity}
                          onChange={e => changeInput(e, row.id)}
                        />
                      </TableCell>
                      <TableCell align="right">{row.total}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow key="suma">
                    <TableCell component="th" scope="row">
                      SUMA
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">{totalPrice()}</TableCell>

                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Button component={Link} to={'/orderForm'} color="inherit" className={styles.button} >Zamawiam i płacę</Button>
          </Paper>
        </Container>
      </div>
    );
  }
}

Component.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  plantsInCart: PropTypes.array,
  changeValue: PropTypes.func,
  changeSelectValue: PropTypes.func,
};

const mapStateToProps = state => ({
  plants: getAll(state),
  plantsInCart: getCart(state),
});

const mapDispatchToProps = dispatch => ({
  changeValue: ({id, value}) => dispatch(changeValue({id, value})), 
  changeSelectValue: ({id, choosenColor}) => dispatch(changeSelectValue({id, choosenColor})),
});

const ContainerConnect = withStyles(useStyles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Component));

export {
  // Component as Cart,
  ContainerConnect as Cart,
  Component as CartComponent,
};