import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

// Motion-enhanced components
export const MotionBox = motion(Box);
export const MotionContainer = motion(Container);
export const MotionPaper = motion(Paper);

// Styled Hero Container - used for main page headers
export const HeroContainer = ({ children, ...props }) => (
  <Box
    sx={{
      minHeight: { xs: '50vh', md: '60vh' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      p: 3,
      background: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
      position: 'relative',
      overflow: 'hidden',
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Box>
);

// Styled Page Container - main content wrapper
export const PageContainer = ({ children, maxWidth = "lg", ...props }) => (
  <Container
    maxWidth={maxWidth}
    sx={{
      py: { xs: 4, md: 6 },
      px: { xs: 2, md: 3 },
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Container>
);

// Styled Card/Paper component
export const StyledCard = ({ children, elevation = 3, animate = true, ...props }) => {
  const Component = animate ? MotionPaper : Paper;
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  } : {};

  return (
    <Component
      elevation={elevation}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: '1.5rem',
        background: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(33, 150, 243, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 188, 212, 0.15)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 12px 48px 0 rgba(0, 188, 212, 0.25)',
          transform: 'translateY(-2px)',
        },
        ...props.sx
      }}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Gradient Title component
export const GradientTitle = ({ children, variant = "h4", component, sx, ...props }) => (
  <Typography
    variant={variant}
    component={component || variant.replace('h', 'h')}
    sx={{
      background: 'linear-gradient(90deg, #2196f3, #00bcd4, #00e5ff, #2196f3)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 800,
      letterSpacing: '-0.5px',
      filter: 'drop-shadow(0 2px 16px #00e5ff33)',
      mb: 2,
      ...sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

// Animated Hero Title (like in HomePage)
export const AnimatedHeroTitle = ({ children, ...props }) => {
  const titleRef = React.useRef(null);

  React.useEffect(() => {
    let frameId;
    let deg = 0;
    const animate = () => {
      deg = (deg + 0.5) % 360;
      if (titleRef.current) {
        titleRef.current.style.background = `linear-gradient(${deg}deg, #2196f3, #00bcd4, #00e5ff, #2196f3)`;
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: 'inline-block',
          background: 'rgba(10,18,30,0.85)',
          borderRadius: '1.5rem',
          padding: '0.7em 1.2em',
          boxShadow: '0 4px 32px 0 #0008',
          mb: 3,
          maxWidth: '100%',
        }}
      >
        <Typography
          ref={titleRef}
          variant="h3"
          component="h1"
          sx={{
            fontSize: { xs: '2rem', md: '3.2rem' },
            fontWeight: 800,
            margin: 0,
            background: 'linear-gradient(90deg, #2196f3 10%, #fff 50%, #00bcd4 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 32px #00e5ff88) drop-shadow(0 1px 0 #fff)',
            letterSpacing: '-1px',
            lineHeight: 1.1,
            userSelect: 'none',
            cursor: 'pointer',
            animation: 'pulseGlow 2.5s infinite alternate',
            textShadow: '0 2px 8px #fff, 0 1px 0 #2196f3',
            wordBreak: 'break-word',
            ...props.sx
          }}
          {...props}
        >
          {children}
        </Typography>
      </Box>
      <style>{`
        @keyframes pulseGlow {
          0% { filter: drop-shadow(0 2px 32px #00e5ff88) drop-shadow(0 1px 0 #fff); }
          100% { filter: drop-shadow(0 2px 64px #2196f388) drop-shadow(0 1px 0 #fff); }
        }
      `}</style>
    </>
  );
};

// Subtitle with gradient
export const GradientSubtitle = ({ children, ...props }) => (
  <Typography
    variant="h5"
    sx={{
      background: 'linear-gradient(90deg, #00bcd4, #2196f3 60%, #00e5ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
      fontSize: { xs: '1.2rem', md: '1.7rem' },
      letterSpacing: '-0.5px',
      textShadow: '0 1px 8px #00e5ff33',
      mb: 3,
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

// Animated Form Container
export const FormContainer = ({ children, maxWidth = "sm", ...props }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    sx={{
      mt: { xs: 4, md: 8 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...props.sx
    }}
    {...props}
  >
    <Container maxWidth={maxWidth}>
      <StyledCard>
        {children}
      </StyledCard>
    </Container>
  </MotionBox>
);

// Section Background
export const SectionBackground = ({ children, variant = "primary", ...props }) => {
  const backgrounds = {
    primary: 'linear-gradient(135deg, #0a121e 80%, #10131a 100%)',
    secondary: 'linear-gradient(135deg, #1e1e1e 80%, #2a2a2a 100%)',
    dark: 'linear-gradient(135deg, #121212 80%, #1e1e1e 100%)'
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        background: backgrounds[variant],
        position: 'relative',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};