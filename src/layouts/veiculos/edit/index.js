/* eslint-disable react/prop-types */
/* eslint-disable no-alert */
/* eslint-disable no-else-return */
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
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Data
import { useEffect, useState } from "react";
import MDInput from "components/MDInput";
import { CircularProgress, Grid, Switch } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useAuth } from "utils/auth";
import MDAlert from "components/MDAlert";

function VeiculosEdit({ allowedRoles }) {
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [ativo, setAtivo] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const auth = useAuth();
  const [erroCadastro, setErroCadastro] = useState(false);
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);

  const handleLogout = () => {
    auth.logout();
    navigate("/login", { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErroCadastro(false);
    const cadastro = { modelo, placa, ativo };

    fetch(API_URL + "/veiculos/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(cadastro),
    })
      .then((res) => {
        if (res.status === 204) {
          alert("Veículo atualizado com sucesso.");
          navigate("/veiculos", { replace: true });
        } else if (res.status !== 401) {
          setErroCadastro(true);
        } else {
          handleLogout();
        }
      })
      .catch();
  };

  const buscaItem = () => {
    fetch(API_URL + "/veiculos/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status !== 401) {
          response.json().then((resultItem) => {
            setModelo(resultItem.modelo);
            setPlaca(resultItem.placa);
            setAtivo(resultItem.ativo);
            setLoading(false);
          });
        } else {
          handleLogout();
        }
      })
      .catch();
  };

  useEffect(() => {
    document.title = "TFWebLog - Editar Veículo";

    fetch(API_URL + "/getData", {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((json) => {
        if (!allowedRoles.includes(json.cargo)) {
          navigate("/login", { replace: true });
        }
      })
      .catch();

    buscaItem();
  }, []);

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
        <MDBox
          component="form"
          role="form"
          pt={3}
          pb={3}
          onSubmit={handleSubmit}
          sx={() => ({
            fontSize: "16px !important",
          })}
        >
          {erroCadastro && (
            <MDAlert
              color="error"
              dismissible
              sx={() => ({
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "300",
                margin: "10px 0 30px 0",
              })}
            >
              Placa já utilizada.
            </MDAlert>
          )}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={0}>
                <MDInput
                  type="text"
                  label="Modelo"
                  fullWidth
                  required
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                />
              </MDBox>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={0}>
                <MDInput
                  type="text"
                  label="Placa"
                  value={placa}
                  fullWidth
                  required
                  onChange={(e) => setPlaca(e.target.value)}
                />
              </MDBox>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={0}>
                <Switch checked={ativo} onChange={() => setAtivo(!ativo)} />
                <MDTypography variant="button" fontWeight="regular" color="text">
                  Ativo
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3} lg={2}>
              <MDBox mt={0}>
                <MDButton type="submit" variant="gradient" color="primary" fullWidth>
                  SALVAR
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  }
}

export default VeiculosEdit;
