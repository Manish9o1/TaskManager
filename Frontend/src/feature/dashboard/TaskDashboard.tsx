import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Typography, IconButton, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { useCreateTaskMutation, useDeleteTaskMutation, useGetTasksQuery, useGetUserQuery, useUpdateTaskMutation } from "../../api/TaskManagerApis";
import type { Task } from "../../shared/model";
import { useState } from "react";

export default function TaskDashboard() {
  const { data: tasks = [], isLoading, error } = useGetTasksQuery();
  const { data: users = [] } = useGetUserQuery();

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Dialog state
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setAssigneeId(task.assigneeId ?? "");
    setOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    if (editingTask) {
      await updateTask({
        id: editingTask.id,
        title,
        description,
        assigneeId,
      });
    } else {
      await createTask({
        title,
        description,
        status: "TODO",
        assigneeId,
      });
    }

    setOpen(false);
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setEditingTask(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
    }
  };

  if (isLoading) return <Typography>Loading tasks...</Typography>;
  if (error) return <Typography color="error">Error loading tasks</Typography>;

  const columns: GridColDef<Task>[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "assigneeId",
      headerName: "Assignee",
      width: 200,
      renderCell: (params) => {
        const user = users.find(u => u.id === params.value);
        return user ? user.username ?? user.email : "Unassigned";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleOpenEdit(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete((params.row.id).toString())}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Task Dashboard
      </Typography>

      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        + New Task
      </Button>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          pageSizeOptions={[5]}
          getRowId={(row) => row.id} // important if id is GUID
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingTask ? "Edit Task" : "Create Task"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="assignee-label">Assignee</InputLabel>
            <Select
              labelId="assignee-label"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              {users.map(u => (
                <MenuItem key={u.id} value={u.id}>
                  {u.username ?? u.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
