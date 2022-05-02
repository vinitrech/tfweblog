/* eslint-disable no-use-before-define */
/* eslint-disable arrow-body-style */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable array-callback-return */
/* eslint-disable no-else-return */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";
import { CircularProgress, Icon } from "@mui/material";
import MDInput from "components/MDInput";
import { useAuth } from "utils/auth";
import exportFromJSON from "export-from-json";

function Usuarios() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [searchInput, setSearchInput] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const columns = [
    { Header: "identificador", accessor: "identificador", align: "center" },
    { Header: "email", accessor: "email", align: "left" },
    { Header: "data", accessor: "data", align: "center" },
    { Header: "ativo", accessor: "ativo", align: "center" },
    { Header: "ações", accessor: "acoes", align: "center", disableSortBy: true },
  ];

  const [rows, setRows] = useState([]);

  const handleRows = (itemsArray) => {
    const temporaryRows = [];

    itemsArray.map((item) => {
      let date = new Date(item.created_at);
      date =
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
  
      temporaryRows.push({
        identificador: item.id,
        email: item.email,
        data: date,
        ativo: !item.ativo ? "Não" : "Sim",
        acoes: (
          <MDBox className="exportLinkInternal">
            <Link to={"/usuarios/" + item.id + "/editar-usuario"} className="exportLinkInternal">
              <MDButton variant="gradient" color="primary">
                <Icon fontSize="medium" color="inherit">
                  edit
                </Icon>
              </MDButton>
            </Link>
            <MDButton
              variant="gradient"
              color="error"
              onClick={(e) => {
                handleErase(e, item.id);
              }}
            >
              <Icon fontSize="medium" color="inherit">
                delete
              </Icon>
            </MDButton>
          </MDBox>
        ),
      });

      setRows(temporaryRows);
    });
  }

  const exportName = "Usuários";
  const type = "xls";

  const handleExportXlsx = () => {
    exportFromJSON({ data, fileName: exportName, exportType: type });
  };

  const setItemsToExport = (itemsArray) => {
    const arrayOfItems = [];

    itemsArray.map((item) => {
      let date = new Date(item.created_at);
      date =
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();

      arrayOfItems.push({
        identificador: item.id,
        email: item.email,
        nome: item.nome,
        cpf: item.cpf,
        data: date,
        ativo: !item.ativo ? "Não" : "Sim",
      });
    });

    setData(arrayOfItems);
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    fetch(
      API_URL +
        "/usuarios?" +
        new URLSearchParams({
          search: searchInput,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
      .then((response) => {
        if (response.status !== 401) {
          response.json().then((itemsArray) => {
            setItemsToExport(itemsArray);
            handleRows(itemsArray);
            setLoading(false);
          });
        } else {
          handleLogout();
        }
      })
      .catch();
  };

  const buscaItens = () => {
    fetch(API_URL + "/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status !== 401) {
          response.json().then((itemsArray) => {
            setItemsToExport(itemsArray);
            handleRows(itemsArray);
            setLoading(false);
          });
        } else {
          handleLogout();
        }
      })
      .catch();
  };

  useEffect(() => {
    document.title = "TFWebLog - Usuários";
    buscaItens();
  }, []);

  const handleErase = (e, id) => {
    e.preventDefault();

    if (confirm("Deseja realmente excluir o registro?")) {
      fetch(API_URL + "/usuarios/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.status === 204) {
            alert("Registro excluído com sucesso.");
            setLoading(true);
            buscaItens();
          } else if (response.status === 401) {
            handleLogout();
          }
        })
        .catch();
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          pt={4}
          className="wrapperHeader"
          sx={() => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  } else {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={2} className="wrapperHeader">
          <Link to="/usuarios/criar-usuario">
            <MDButton variant="gradient" color="primary">
              + Novo Usuário
            </MDButton>
          </Link>

          <MDBox
            component="form"
            role="form"
            onSubmit={(e) => handleSearchSubmit(e)}
            className="exportLink"
          >
            <MDButton
              variant="gradient"
              color="primary"
              onClick={handleExportXlsx}
              sx={() => ({
                marginRight: "10px",
              })}
            >
              <Icon fontSize="medium" color="inherit">
                file_open
              </Icon>
            </MDButton>
            <MDBox className="inputWrapper">
              <MDInput
                type="text"
                required
                value={searchInput}
                label="Buscar..."
                onChange={(e) => setSearchInput(e.target.value)}
                className="inputWrapperInternal"
              />
            </MDBox>
            <MDBox className="searchButton">
              <MDButton type="submit" variant="gradient" color="primary">
                <Icon fontSize="medium" color="inherit">
                  search
                </Icon>
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
        <MDBox pt={5} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns, rows }}
                    entriesPerPage
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  }
}

export default Usuarios;
