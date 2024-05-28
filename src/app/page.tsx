"use client";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid";
import { Button, Divider, FormControlLabel, FormLabel, IconButton, Modal, Radio, RadioGroup, TextField } from "@mui/material";
import { useGetUsersQuery } from "@/services/usersApi";
import { IUser } from "@/types/user";
import { Edit } from "@mui/icons-material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function Home() {

  // Status
  const [open, setOpen] = React.useState(false);

  const [trigger, setTrigger] = React.useState(0);

  const [rows, setRows] = React.useState<IUser[]>([]);

  const [title, setTitle] = React.useState<string>('');

  const [id, setId] = React.useState<number>(0);

  const [isEditable, setIsEditable] = React.useState<boolean>(false);

  const [status, setStatus] = React.useState<string>('');

  // services
  const { data } = useGetUsersQuery({});

  //GRid Data
  const columns: GridColDef<(IUser)>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Titulo",
      width: 550,
      editable: true,
    },
    {
      field: "completed",
      headerName: "Estado",
      width: 150,
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <GridDeleteIcon />
          </IconButton>
        </div>
      ),
    },

  ];


  // Actions
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setTitle('');
    setStatus('');
    setIsEditable(false);
    setOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    const data = rows;
    const formatData = data?.filter((el: IUser) => el.id !== id);
    setRows(formatData);
    setTrigger(state => state + 1);
  };

  const handleEditClick = (user: IUser) => {
    handleOpen();
    setId(user.id);
    setIsEditable(true);
    setTitle(user.title);
    setStatus(user.completed);
  };

  const onSubmit = () => {
    if (title?.length && status) {
      const formatData = rows;
      const newData = [{ id: new Date().getTime(), title, completed: status }];

      if (!isEditable) {
        setRows([...newData, ...formatData]);
      } else {
        const formatData = rows?.map(el => {
          if (el.id === id) {
            return {
              completed: status, id, title
            };
          }

          return el;
        });

        setRows(formatData as unknown as IUser[]);
      }

      handleClose();
    }
  };

  // Effects
  React.useEffect(() => {
    if (trigger) {
      const formatData = rows?.map((el: IUser) => ({
        id: el.id,
        title: el.title,
        completed: el.completed ? 'Completado' : 'Incompleto',
      }));
      setRows(formatData as unknown as IUser[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  React.useEffect(() => {
    if (data?.length) {
      const formatData = data?.map((el: IUser) => ({
        id: el.id,
        title: el.title,
        completed: el.completed ? 'Completado' : 'Incompleto',
      }));

      setRows(formatData);
    }
  }, [data]);

  return (
    <Box sx={{ width: "80%", margin: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box mb={2} component={"h1"}>
          CRUD en Next.js
        </Box>
        <Box>
          <Button
            variant="contained"
            color="info"
            startIcon={<AddCircleIcon />}
            onClick={handleOpen}
          >
            Agregar
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows as unknown as IUser[]}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ textAlign: 'center', fontSize: '28px' }}>Registro</Box>
            <Divider />
            <TextField
              value={title}
              size="small"
              fullWidth sx={{ margin: '20px 0px' }}
              label='Titulo'
              variant="filled"
              onChange={({ target }) => {
                setTitle(target.value);
              }}
            />
            <Box mb={2}>
              <FormLabel id="demo-radio-buttons-group-label">Estado</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Incompleto"
                name="radio-buttons-group"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <FormControlLabel value="Completado" control={<Radio />} label="Completado" />
                <FormControlLabel value="Incompleto" control={<Radio />} label="Incompleto" />
              </RadioGroup>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={onSubmit}
              disabled={!title?.length || !status}
            >
              {isEditable ? 'Editar' : 'Guardar'}
            </Button>
          </Box>
        </Modal>
      </div>
    </Box>
  );
}
