import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Image from "next/image";
import Link from "next/link";

const Error = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      <Image
        src={"/images/backgrounds/errorimg.svg"}
        alt="404" width={500} height={500}
        style={{ width: "100%", maxWidth: "500px", maxHeight: '500px' }}
      />
      <Typography align="center" variant="h1" mb={4}>
        Opps!!!
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
      La page que vous recherchez est introuvable.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        component={Link}
        href="/"
        disableElevation
      >
        Retourner à la maison
      </Button>
    </Container>
  </Box>
);

export default Error;
