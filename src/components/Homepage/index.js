import React from "react";
import {
  Typography,
  Button,
  Menu,
  MenuItem,
  Paper,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import classes from "./Homepage.module.css";
import axios from "axios";
import { cities } from "./cities";

export default function Homepage() {
  const [state, setState] = React.useState({
    anchorEl: null,
    button: "select city",
    totalCount: 5,
    banks: [],
    page: 0,
    rowsPerPage: 10,
  });
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const cityquery = state.button === "select city" ? "" : state.button;
    const offset = state.rowsPerPage * state.page + 1;
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.REACT_APP_URL;

    axios
      .get(
        `${baseUrl}/api/branches?q=${cityquery}&limit=${state.rowsPerPage}&offset=${offset}`
      )
      .then((res) => {
        setState({
          ...state,
          totalCount: parseInt(res.data.banks[0].full_count),
          banks: res.data.banks,
        });
      });

    // axios.get(`${baseUrl}/api/cities`, config).then((res) => {
    //   setState({
    //     ...state,
    //     cities: res.data.cities,
    //   });
    // });
  }, []);

  const searchByCity = async (city, limit, offset) => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.REACT_APP_URL;
    const result = await axios.get(
      `${baseUrl}/api/branches?q=${city}&limit=${limit}&offset=${offset}`
    );
    return result;
  };
  const searchAll = async (limit, offset) => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.REACT_APP_URL;
    const result = await axios.get(
      `${baseUrl}/api/branches?limit=${limit}&offset=${offset}`
    );
    return result;
  };

  const searchByQuery = async (query, limit, offset) => {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.REACT_APP_URL;

    const result = await axios.get(
      `${baseUrl}/api/branches/autocomplete?q=${query}&limit=${limit}&offset=${offset}`
    );

    return result;
  };

  const handleClick = (event) => {
    setState({
      ...state,

      anchorEl: event.currentTarget,
    });
  };

  const handleClose = async (event) => {
    if (event.target.innerText !== "") {
      const result = await searchByCity(
        event.target.innerText,
        state.rowsPerPage,
        state.rowsPerPage * 0 + 1
      );

      setSearchQuery("");
      setState({
        ...state,
        anchorEl: null,
        banks: result.data.banks,
        page: 0,

        totalCount: parseInt(result.data.banks[0]?.full_count),
        button: event.target.innerText || state.button,
      });
    } else {
      setState({
        ...state,
        anchorEl: null,

        button: event.target.innerText || state.button,
      });
    }
  };

  const handleChangePage = async (event, newPage) => {
    const offset = state.rowsPerPage * newPage + 1;
    let result;
    if (state.button === "select city" && searchQuery === "") {
      result = await searchAll(state.rowsPerPage, offset);
      console.log(result);
    } else if (state.button !== "select city" && searchQuery === "") {
      result = await searchByCity(state.button, state.rowsPerPage, offset);
    } else if (state.button === "select city" && searchQuery !== "") {
      result = await searchByQuery(searchQuery, state.rowsPerPage, offset);
    }
    setState({
      ...state,
      banks: result.data.banks,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = async (event) => {
    const offset = event.target.value * 0 + 1;
    let result;
    if (state.button === "select city" && searchQuery === "") {
      result = await searchAll(event.target.value, offset);
    } else if (state.button !== "select city" && searchQuery === "") {
      result = await searchByCity(state.button, event.target.value, offset);
    } else if (state.button === "select city" && searchQuery !== "") {
      result = await searchByQuery(searchQuery, event.target.value, offset);
    }
    setState({
      ...state,
      page: 0,
      banks: result.data.banks,
      rowsPerPage: event.target.value,
    });
  };

  const favHandle = (event, id) => {
    console.log(id);
  };
  const searchHandler = async (event) => {
    setSearchQuery(event.target.value);
    const result = await searchByQuery(
      event.target.value,
      state.rowsPerPage,
      state.rowsPerPage * 0 + 1
    );

    setState({
      ...state,
      banks: result.data.banks,
      button: "select city",
      totalCount: parseInt(result.data.banks[0]?.full_count),
      page: 0,
    });
  };
  const columns = [
    { id: "fav", label: "Favourite", minWidth: 100, checkbox: true },
    { id: "bank_id", label: "Bank id", minWidth: 170 },
    { id: "ifsc", label: "IFSC", minWidth: 100 },
    {
      id: "bank_name",
      label: "Bank name",
      minWidth: 170,
      align: "right",
    },
    {
      id: "branch",
      label: "Branch",
      minWidth: 170,
      align: "right",
    },
    {
      id: "city",
      label: "City",
      minWidth: 170,
      align: "right",
    },
    {
      id: "district",
      label: "District",
      minWidth: 170,
      align: "right",
    },
    {
      id: "state",
      label: "State",
      minWidth: 170,
      align: "right",
    },
    {
      id: "address",
      label: "Address",
      minWidth: 170,
      align: "right",
    },
  ];

  function createData(
    bank_id,
    ifsc,
    bank_name,
    branch,
    city,
    district,
    state,
    address
  ) {
    const check = null;
    return {
      check,
      bank_id,
      ifsc,
      bank_name,
      branch,
      city,
      district,
      state,
      address,
    };
  }

  //   const rows = [
  //     createData("India", "IN", 1324171354, 3287263),
  //     createData("China", "CN", 1403500365, 9596961),
  //     createData("Italy", "IT", 60483973, 301340),
  //     createData("United States", "US", 327167434, 9833520),
  //     createData("Canada", "CA", 37602103, 9984670),
  //     createData("Australia", "AU", 25475400, 7692024),
  //     createData("Germany", "DE", 83019200, 357578),
  //     createData("Ireland", "IE", 4857000, 70273),
  //     createData("Mexico", "MX", 126577691, 1972550),
  //     createData("Japan", "JP", 126317000, 377973),
  //     createData("France", "FR", 67022000, 640679),
  //     createData("United Kingdom", "GB", 67545757, 242495),
  //     createData("Russia", "RU", 146793744, 17098246),
  //     createData("Nigeria", "NG", 200962417, 923768),
  //     createData("Brazil", "BR", 210147125, 8515767),
  //   ];

  const rows = state.banks.map((bank) => {
    return createData(
      bank.bank_id,
      bank.ifsc,
      bank.bank_name,
      bank.branch,
      bank.city,
      bank.district,
      bank.state,
      bank.address
    );
  });

  return (
    <div>
      <Typography variant="h1" component="h2" className={classes.Heading}>
        Bank Branches
      </Typography>
      <div className={classes.Actions}>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.PopButton}
        >
          {state.button}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={state.anchorEl}
          keepMounted
          open={Boolean(state.anchorEl)}
          onClose={handleClose}
        >
          {cities.map((city) => (
            <MenuItem onClick={handleClose} key={city}>
              {city}
            </MenuItem>
          ))}
        </Menu>

        <Paper component="form" className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder="Search Google Maps"
            inputProps={{ "aria-label": "search google maps" }}
            value={searchQuery}
            onChange={searchHandler}
          />

          <Search />
        </Paper>
      </div>
      <Paper className={classes.rootTable}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.checkbox) {
                        return (
                          <TableCell padding="checkbox" key={column.id}>
                            <Checkbox onClick={(e) => favHandle(e, row.code)} />
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={state.totalCount}
          rowsPerPage={state.rowsPerPage}
          page={state.page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
