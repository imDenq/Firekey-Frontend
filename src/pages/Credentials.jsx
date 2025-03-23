// src/pages/Credentials.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Toolbar,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { useSnackbar } from 'notistack'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import CredentialItem from '../components/Credentials/CredentialItem'

export default function Credentials() {
  const drawerWidth = 240
  const { enqueueSnackbar } = useSnackbar()
  const [credentials, setCredentials] = useState([])
  const accessToken = localStorage.getItem('accessToken') || ''

  // States pour la vérification du mot de passe
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [verifyModalCred, setVerifyModalCred] = useState(null)
  const [verifyPurpose, setVerifyPurpose] = useState('') // 'unlock' ou 'disableSensitive'
  const [typedPassword, setTypedPassword] = useState('')

  // States pour la création d'un nouveau credential
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newWebsite, setNewWebsite] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newNote, setNewNote] = useState('')
  const [newIsSensitive, setNewIsSensitive] = useState(false)

  // States pour l'édition d'un credential
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editWebsite, setEditWebsite] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editNote, setEditNote] = useState('')
  const [editIsSensitive, setEditIsSensitive] = useState(false)

  // States pour la suppression d'un credential
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Chargement initial
  useEffect(() => {
    fetchCredentials()
  }, [])

  // ---------------------------------------
  // 1) Récupérer la liste
  // ---------------------------------------
  const fetchCredentials = async () => {
    try {
      const res = await fetch('http://localhost:8001/api/credentials/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      if (!res.ok) {
        throw new Error('Erreur fetch credentials')
      }
      const data = await res.json()
      setCredentials(data)
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Impossible de récupérer la liste des credentials', { variant: 'error' })
    }
  }

  // ---------------------------------------
  // 2) Ajout d'un credential
  // ---------------------------------------
  const handleOpenAddModal = () => setAddModalOpen(true)
  const handleCloseAddModal = () => {
    setAddModalOpen(false)
    setNewName('')
    setNewWebsite('')
    setNewEmail('')
    setNewPassword('')
    setNewNote('')
    setNewIsSensitive(false)
  }

  const handleSaveCredential = async () => {
    if (!newName.trim()) {
      enqueueSnackbar('Le champ Nom est requis', { variant: 'error' })
      return
    }

    try {
      const body = {
        name: newName.trim(),
        website: newWebsite.trim(),
        email: newEmail.trim(),
        password: newPassword || 'password123',
        note: newNote.trim(),
        is_sensitive: newIsSensitive
      }
      const res = await fetch('http://localhost:8001/api/credentials/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Erreur ajout credential')
      }
      const newCred = await res.json()
      setCredentials((prev) => [...prev, newCred])
      enqueueSnackbar('Credential ajouté avec succès', { variant: 'success' })
      handleCloseAddModal()
    } catch (err) {
      console.error(err)
      enqueueSnackbar(err.message, { variant: 'error' })
    }
  }

  // ---------------------------------------
  // 3) Édition d'un credential
  // ---------------------------------------
  const handleOpenEditModal = (cred) => {
    setEditId(cred.id)
    setEditName(cred.name)
    setEditWebsite(cred.website || '')
    setEditEmail(cred.email || '')
    setEditNote(cred.note || '')
    // IMPORTANT: utiliser la propriété is_sensitive
    setEditIsSensitive(cred.is_sensitive)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setEditId(null)
    setEditName('')
    setEditWebsite('')
    setEditEmail('')
    setEditNote('')
    setEditIsSensitive(false)
  }

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      enqueueSnackbar('Le champ Nom est requis', { variant: 'error' })
      return
    }
    try {
      const body = {
        name: editName.trim(),
        website: editWebsite.trim(),
        email: editEmail.trim(),
        note: editNote.trim(),
        // IMPORTANT: is_sensitive, pas isSensitive
        is_sensitive: editIsSensitive
      }
      const res = await fetch(`http://localhost:8001/api/credentials/${editId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Erreur edition credential')
      }
      const updated = await res.json()
      setCredentials((prev) => prev.map((c) => (c.id === editId ? updated : c)))
      enqueueSnackbar('Credential modifié avec succès', { variant: 'success' })
      handleCloseEditModal()
    } catch (err) {
      console.error(err)
      enqueueSnackbar(err.message, { variant: 'error' })
    }
  }

  // ---------------------------------------
  // 4) Suppression d'un credential
  // ---------------------------------------
  const handleOpenDeleteModal = (cred) => {
    setDeleteId(cred.id)
    setDeleteModalOpen(true)
  }
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setDeleteId(null)
  }

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8001/api/credentials/${deleteId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Erreur suppression credential')
      }
      setCredentials((prev) => prev.filter((c) => c.id !== deleteId))
      enqueueSnackbar('Credential supprimé avec succès', { variant: 'success' })
      handleCloseDeleteModal()
    } catch (err) {
      console.error(err)
      enqueueSnackbar(err.message, { variant: 'error' })
    }
  }

  // ---------------------------------------
  // 5) Déverrouillage (toggle password)
  // ---------------------------------------
  const handleTogglePassword = (cred) => {
    // Si pas unlocké => on veut déverrouiller
    if (!cred.unlocked) {
      if (cred.is_sensitive) {
        // S'il est sensible, on demande le mdp
        setVerifyModalCred(cred)
        setVerifyPurpose('unlock')
        setTypedPassword('')
        setVerifyModalOpen(true)
      } else {
        // Non sensible => on appelle directement /decrypt/
        decryptNonSensitive(cred)
      }
    } else {
      // Si déjà unlocké => on re-masque
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === cred.id ? { ...c, unlocked: false } : c
        )
      )
    }
  }

  // Déchiffrer un credential non-sensible sans exiger le mot de passe de compte
  const decryptNonSensitive = async (cred) => {
    try {
      const res = await fetch(`http://localhost:8001/api/credentials/${cred.id}/decrypt/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Impossible de déchiffrer')
      }
      const data = await res.json() // { password: "..." }

      // Mettre à jour localement
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === cred.id ? { ...c, password: data.password, unlocked: true } : c
        )
      )
      enqueueSnackbar('Mot de passe affiché', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar(err.message, { variant: 'error' })
    }
  }

  // ---------------------------------------
  // 6) Changement "Sensible"
  // ---------------------------------------
  const handleSensitiveChange = (cred, checked) => {
    // On veut désactiver "sensible" => demander mdp
    if (cred.is_sensitive && !checked) {
      setVerifyModalCred(cred)
      setVerifyPurpose('disableSensitive')
      setTypedPassword('')
      setVerifyModalOpen(true)
    } else {
      // Cas normal: on active la sensibilité, ou on modifie sans mdp
      patchIsSensitive(cred, checked)
    }
  }

  const patchIsSensitive = async (cred, checked) => {
    try {
      const body = { is_sensitive: checked }
      const res = await fetch(`http://localhost:8001/api/credentials/${cred.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Erreur maj "sensible"')
      }
      const updated = await res.json()
      setCredentials((prev) => prev.map((c) => (c.id === cred.id ? updated : c)))
      enqueueSnackbar('Modification enregistrée', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar(err.message, { variant: 'error' })
    }
  }

  // ---------------------------------------
  // 7) Vérification du mot de passe de compte
  // ---------------------------------------
  const handleVerifyPassword = async () => {
    if (!verifyModalCred) return

    try {
      // 1) Vérifier le mot de passe de compte
      const verifyRes = await fetch(`http://localhost:8001/api/credentials/${verifyModalCred.id}/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ password: typedPassword })
      })
      if (!verifyRes.ok) {
        const data = await verifyRes.json()
        throw new Error(data.error || 'Erreur de vérification')
      }

      // 2) Selon le but (unlock ou disableSensitive)
      if (verifyPurpose === 'unlock') {
        // On appelle decrypt
        const decryptRes = await fetch(`http://localhost:8001/api/credentials/${verifyModalCred.id}/decrypt/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        })
        if (!decryptRes.ok) {
          const errData = await decryptRes.json()
          throw new Error(errData.error || 'Impossible de déchiffrer')
        }
        const data = await decryptRes.json() // { password: "..." }

        // On met à jour le credential
        setCredentials((prev) =>
          prev.map((c) =>
            c.id === verifyModalCred.id ? { ...c, password: data.password, unlocked: true } : c
          )
        )
        enqueueSnackbar('Déverrouillé avec succès', { variant: 'success' })

      } else if (verifyPurpose === 'disableSensitive') {
        // On PATCH is_sensitive = false
        await patchIsSensitive(verifyModalCred, false)
      }

      // On ferme la modale
      setVerifyModalOpen(false)
      setVerifyModalCred(null)
      setVerifyPurpose('')
      setTypedPassword('')

    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' })
    }
  }

  // ---------------------------------------
  // Rendu
  // ---------------------------------------
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Topbar drawerWidth={drawerWidth} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          Mes Credentials
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#8b949e' }}>
          Ajoutez, gérez et protégez vos informations de connexion.
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpenAddModal}
          sx={{ mb: 2, backgroundColor: 'white', color: 'black', textTransform: 'none' }}
        >
          Add Credential
        </Button>

        <Grid container direction="column" spacing={2}>
          {credentials.map((cred) => (
            <Grid item key={cred.id}>
              <CredentialItem
                cred={cred}
                onTogglePassword={handleTogglePassword}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onSensitiveChange={handleSensitiveChange}
              />
            </Grid>
          ))}
        </Grid>

        {/* Dialog d'ajout */}
        <Dialog
          open={addModalOpen}
          onClose={handleCloseAddModal}
          PaperProps={{
            sx: { backgroundColor: '#21262d', color: 'white', minWidth: 400 }
          }}
        >
          <DialogTitle>Ajouter un Credential</DialogTitle>
          <DialogContent>
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              label="Site web"
              variant="outlined"
              fullWidth
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              sx={{ ...textFieldStyle, mt: 2 }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              sx={{ ...textFieldStyle, mt: 2 }}
            />
            <TextField
              label="Mot de passe"
              variant="outlined"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ ...textFieldStyle, mt: 2 }}
            />
            <TextField
              label="Note"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              sx={{ ...textFieldStyle, mt: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newIsSensitive}
                  onChange={(e) => setNewIsSensitive(e.target.checked)}
                  sx={{
                    color: '#8b949e',
                    '&.Mui-checked': { color: '#58a6ff' },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#8b949e' }}>
                  Sensible
                </Typography>
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseAddModal}
              sx={{
                color: 'white',
                textTransform: 'none',
                borderColor: '#8b949e',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveCredential}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog d'édition */}
        <Dialog
          open={editModalOpen}
          onClose={handleCloseEditModal}
          PaperProps={{
            sx: { backgroundColor: '#21262d', color: 'white', minWidth: 400 }
          }}
        >
          <DialogTitle>Modifier un Credential</DialogTitle>
          <DialogContent>
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              label="Site web"
              variant="outlined"
              fullWidth
              value={editWebsite}
              onChange={(e) => setEditWebsite(e.target.value)}
              sx={{ ...textFieldStyle, mt: 2 }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              sx={{ ...textFieldStyle, mt: 2 }}
            />
            <TextField
              label="Note"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              sx={{ ...textFieldStyle, mt: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editIsSensitive}
                  onChange={(e) => setEditIsSensitive(e.target.checked)}
                  sx={{
                    color: '#8b949e',
                    '&.Mui-checked': { color: '#58a6ff' },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#8b949e' }}>
                  Sensible
                </Typography>
              }
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseEditModal}
              sx={{
                color: 'white',
                textTransform: 'none',
                borderColor: '#8b949e',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveEdit}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <Dialog
          open={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          PaperProps={{
            sx: { backgroundColor: '#21262d', color: 'white', minWidth: 300 }
          }}
        >
          <DialogTitle>Supprimer ce credential ?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#8b949e' }}>
              Cette action est irréversible.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDeleteModal}
              sx={{
                color: 'white',
                textTransform: 'none',
                borderColor: '#8b949e',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de vérification de mot de passe */}
        <Dialog
          open={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          PaperProps={{
            sx: { backgroundColor: '#21262d', color: 'white', minWidth: 300 }
          }}
        >
          <DialogTitle>Vérification du mot de passe</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#8b949e', mb: 2 }}>
              Entrez votre mot de passe de compte pour confirmer cette action.
            </Typography>
            <TextField
              label="Mot de passe"
              variant="outlined"
              type="password"
              fullWidth
              value={typedPassword}
              onChange={(e) => setTypedPassword(e.target.value)}
              sx={textFieldStyle}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setVerifyModalOpen(false)}
              sx={{
                color: 'white',
                textTransform: 'none',
                borderColor: '#8b949e',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={handleVerifyPassword}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#f0f0f0' },
              }}
            >
              Valider
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

// Style commun pour les TextField
const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#0d1117',
    color: 'white',
    '& fieldset': { borderColor: '#30363d' },
    '&:hover fieldset': { borderColor: '#8b949e' },
    '&.Mui-focused fieldset': { borderColor: '#58a6ff' },
  },
  label: { color: '#8b949e' },
}
