import { Box, BoxProps, styled } from "@mui/material";

const StyledRecipeCardOverlayBox = styled(Box)`
  background-color: rgba(250, 249, 247, 0.8); /* rgba(250, 249, 247, 0.8) for #faf9f7 with 80% opacity */
  backdrop-filter: blur(4px);
  border: 1px solid hsl(var(--border)); /* Using CSS variable for border */
`;

const overlayDefaultProps: Partial<BoxProps> = {
  bottom: 0,
  display: "flex",
  position: "absolute",
  maxWidth: 250,
  p: 1,
  width: "100%",
};

export const StyledRecipeCardOverlay = (props: BoxProps) => (
  <StyledRecipeCardOverlayBox {...overlayDefaultProps} {...props} />
);

const StyledRecipeCardBox = styled(Box)`
  a {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    color: inherit;
    text-decoration: none;
  }

  a .overlay .MuiTypography-root {
    transition: all 150ms ease-in-out;
    color: hsl(var(--foreground)); /* Using CSS variable for foreground */
    font-family: 'Noto Serif', serif; /* Using Noto Serif for recipe titles */
  }

  a:hover .overlay .MuiTypography-root {
    font-weight: 500; /* Medium weight instead of bold */
    color: hsl(var(--primary)); /* Primary color on hover */
  }

  img {
    object-fit: cover;
    border-radius: var(--radius); /* Using CSS variable for border radius */
  }
`;

const cardDefaultProps: Partial<BoxProps> = {
  display: "flex",
  position: "relative",
  flex: "0 0 250px",
  maxWidth: 250,
  maxHeight: 250,
  borderRadius: "var(--radius)", /* Using CSS variable for border radius */
  overflow: "hidden",
  border: "1px solid hsl(var(--border))", /* Using CSS variable for border */
  backgroundColor: "hsl(var(--card))", /* Using CSS variable for card background */
  transition: "all 0.2s ease-in-out",
};

const StyledRecipeCard = (props: BoxProps) => (
  <StyledRecipeCardBox 
    {...cardDefaultProps} 
    {...props} 
    _hover={{
      borderColor: "hsl(var(--primary))",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
    }}
  />
);

export default StyledRecipeCard;
