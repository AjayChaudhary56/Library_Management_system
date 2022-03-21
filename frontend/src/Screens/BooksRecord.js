import { Button, Container, Grid, Grow, Paper, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const StudentsRecordScreen = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCollege, setSearchCollege] = useState("");
  const [searchFaculty, setSearchFaculty] = useState("");
  const [searchSemester, setSearchSemester] = useState("");
  const [searchBookName, setSearchBookName] = useState("");
  const navigate = useNavigate();

  const columns =
    data[0] &&
    Object.keys(data[0]).map((column) => {
      return {
        field: column,
        headerName: column,
        width: 200,
      };
    });
  //   if (columns) {
  //     console.log(columns.map((column) => column["field"]));
  //   }

  const fun = useCallback(async () => {
    const response = await axios.get("http://localhost:5000/getBooks");
    // console.log(response.data);
    setData(response.data.data);
  }, []);

  const onDelete = async () => {
    await axios.get(
      `http://localhost:5000/deleteBook/${editData.college}${editData.batch}${editData.faculty}${editData.rollno}`
    );
    setEditData(null);
    fun();
  };

  useEffect(() => {
    fun();
  }, [fun]);

  return (
    <Grow in>
      <Container maxWidth="lg">
        <Grid container spacing={2} sx={{ margin: "30px 5px" }}>
          <TextField
            label="Search By Id"
            placeholder="Search By Id"
            sx={{ padding: "5px" }}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
          />
          <TextField
            label="Search By Name"
            placeholder="Search By Name"
            sx={{ padding: "5px" }}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <TextField
            label="Search By College"
            placeholder="Search By College"
            sx={{ padding: "5px" }}
            value={searchCollege}
            onChange={(e) => setSearchCollege(e.target.value.toUpperCase())}
          />
          <TextField
            label="Search By Faculty"
            placeholder="Search By Faculty"
            sx={{ padding: "5px" }}
            value={searchFaculty}
            onChange={(e) => setSearchFaculty(e.target.value.toUpperCase())}
          />
          <TextField
            label="Search By Semester"
            placeholder="Search By Semester"
            sx={{ padding: "5px" }}
            value={searchSemester}
            onChange={(e) => setSearchSemester(e.target.value)}
          />
           <TextField
            label="Search By BookName"
            placeholder="Search By BookName"
            sx={{ padding: "5px" }}
            value={searchBookName}
            onChange={(e) => setSearchBookName(e.target.value)}
          />
          <Button
            variant="outlined"
            color="primary"
            disabled={
              searchName === "" &&
              searchSemester === "" &&
              searchCollege === "" &&
              searchFaculty === "" &&
              searchBookName === "" &&
              searchId === ""
                ? true
                : false
            }
            onClick={async () => {
              console.log(
                searchName,
                searchId,
                searchCollege,
                searchFaculty,
                searchSemester,
                searchBookName
              );
              const res = await axios.get(
                `http://localhost:5000/getbookbyfilter`,
                {
                  params: {
                    id: searchId,
                    name: searchName,
                    college: searchCollege,
                    faculty: searchFaculty,
                    bookName: searchBookName,
                    semester: searchSemester,
                  },
                }
              );
              // console.log(res.data);
              setData(res.data.data);
            }}
          >
            Search
          </Button>
        </Grid>
        <Grid container spacing={0} sx={{ margin: "30px 0px" }}>
          <Paper
            elevation={4}
            sx={{ display: "flex", flex: 1, flexDirection: "column" }}
          >
            <Grid item style={{ height: "75vh", width: "100%" }}>
              {data[0] && (
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={8}
                  sx={{
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  rowsPerPageOptions={[5]}
                  onRowClick={(item) => {
                    setEditData(item.row);
                  }}
                  //   disableSelectionOnClick
                />
              )}
            </Grid>
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                sx={{ margin: "10px" }}
                disabled={!editData}
                onClick={() => {
                  navigate("/addBook/edit", {
                    state: editData,
                  });
                }}
              >
                Edit
              </Button>
              <Button
                type="submit"
                variant="outlined"
                color="warning"
                sx={{ margin: "10px" }}
                disabled={!editData}
                onClick={onDelete}
              >
                Delete
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </Grow>
  );
};

export default StudentsRecordScreen;
