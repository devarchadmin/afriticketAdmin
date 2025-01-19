import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from "next/link";

import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

export default function AuthForgotPassword(){
 return (
  <>
    <Stack mt={4} spacing={2}>
      <CustomFormLabel htmlFor="reset-email">Adresse email</CustomFormLabel>
      <CustomTextField id="reset-email" variant="outlined" fullWidth />

      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        href="/"
      >
        Mot de passe oublié
      </Button>
      <Button
        color="primary"
        size="large"
        fullWidth
        component={Link}
        href="/auth/login"
      >
        Retour à la connexion
      </Button>
    </Stack>
  </>
)};
