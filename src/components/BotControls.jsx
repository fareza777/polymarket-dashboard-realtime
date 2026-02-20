import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Alert,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  RestartAlt as RestartIcon,
  PowerSettingsNew as PowerIcon,
} from '@mui/icons-material';

const BotControls = ({ 
  botStatus, 
  onRestart, 
  onStop, 
  onRefresh,
  isRestarting,
  isStopping 
}) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [config, setConfig] = useState({
    trigger_price: 0.82,
    max_buy_price: 0.91,
    sell_price: 0.96,
    stop_loss_price: 0.75,
    fixed_trade_amount: 5.5,
    enable_btc_trading: true,
    enable_eth_trading: true,
    min_elapsed_minutes: 8,
    min_time_remaining_seconds: 240,
    use_market_orders_for_sell: false,
  });

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConfig = () => {
    // In production, this would save to config.json via API
    console.log('Saving config:', config);
    setConfigDialogOpen(false);
    // Show success message
  };

  const handleConfirmAction = (action) => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  const handleExecuteAction = () => {
    setConfirmDialogOpen(false);
    switch (confirmAction) {
      case 'restart':
        onRestart();
        break;
      case 'stop':
        onStop();
        break;
      default:
        break;
    }
    setConfirmAction(null);
  };

  const controlButtons = [
    {
      label: 'Restart Bot',
      icon: <RestartIcon />,
      color: 'warning',
      onClick: () => handleConfirmAction('restart'),
      disabled: isRestarting || !botStatus?.running,
      loading: isRestarting,
      description: 'Gracefully restart the trading bot',
    },
    {
      label: 'Stop Bot',
      icon: <StopIcon />,
      color: 'error',
      onClick: () => handleConfirmAction('stop'),
      disabled: isStopping || !botStatus?.running,
      loading: isStopping,
      description: 'Stop the trading bot immediately',
    },
    {
      label: 'Refresh Data',
      icon: <RefreshIcon />,
      color: 'primary',
      onClick: onRefresh,
      description: 'Force refresh all dashboard data',
    },
    {
      label: 'Edit Config',
      icon: <SettingsIcon />,
      color: 'info',
      onClick: () => setConfigDialogOpen(true),
      description: 'Modify bot trading parameters',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bot Controls
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage and control the Polymarket trading bot.
      </Typography>

      {/* Bot Status Alert */}
      <Alert 
        severity={botStatus?.running ? 'success' : 'error'} 
        sx={{ mb: 3 }}
        icon={botStatus?.running ? <PlayIcon /> : <StopIcon />}
      >
        <Typography variant="subtitle1" fontWeight="medium">
          Bot Status: {botStatus?.running ? 'RUNNING' : 'STOPPED'}
        </Typography>
        {botStatus?.running ? (
          <Typography variant="body2">
            PID: {botStatus.pid} • CPU: {botStatus.cpuPercent}% • Memory: {botStatus.memoryMB}MB
          </Typography>
        ) : (
          <Typography variant="body2">
            The bot is currently stopped. Start it to begin trading.
          </Typography>
        )}
      </Alert>

      {/* Control Buttons */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {controlButtons.map((button, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: button.disabled ? 'not-allowed' : 'pointer',
                opacity: button.disabled ? 0.6 : 1,
              }}
              onClick={button.disabled ? undefined : button.onClick}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {button.loading ? (
                    <CircularProgress size={40} color={button.color} />
                  ) : (
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: `${button.color}.light`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                      }}
                    >
                      {React.cloneElement(button.icon, {
                        sx: { fontSize: 30, color: `${button.color}.main` }
                      })}
                    </Box>
                  )}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {button.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {button.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Current Configuration */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">
              Current Configuration
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setConfigDialogOpen(true)}
            >
              Edit Config
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Trigger Price
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                ${config.trigger_price}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Max Buy Price
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                ${config.max_buy_price}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Sell Target
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                ${config.sell_price}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Stop Loss
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                ${config.stop_loss_price}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Trade Amount
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                ${config.fixed_trade_amount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                BTC Trading
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {config.enable_btc_trading ? 'Enabled' : 'Disabled'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                ETH Trading
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {config.enable_eth_trading ? 'Enabled' : 'Disabled'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Min Wait Time
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {config.min_elapsed_minutes} min
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Alert severity="info">
                <Typography variant="subtitle2" gutterBottom>
                  Health Check
                </Typography>
                <Typography variant="body2" paragraph>
                  Run a manual health check to verify bot status and API connectivity.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={onRefresh}
                >
                  Run Health Check
                </Button>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Alert severity="warning">
                <Typography variant="subtitle2" gutterBottom>
                  Emergency Stop
                </Typography>
                <Typography variant="body2" paragraph>
                  Immediately stop all trading activity. Use only in emergencies.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<PowerIcon />}
                  onClick={() => handleConfirmAction('stop')}
                  disabled={!botStatus?.running}
                >
                  Emergency Stop
                </Button>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog 
        open={configDialogOpen} 
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <SettingsIcon sx={{ mr: 1 }} />
            Edit Bot Configuration
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Modify trading parameters. Changes will take effect after bot restart.
          </DialogContentText>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trigger Price"
                type="number"
                value={config.trigger_price}
                onChange={(e) => handleConfigChange('trigger_price', parseFloat(e.target.value))}
                inputProps={{ step: 0.01, min: 0, max: 1 }}
                helperText="Price threshold to trigger buy"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Buy Price"
                type="number"
                value={config.max_buy_price}
                onChange={(e) => handleConfigChange('max_buy_price', parseFloat(e.target.value))}
                inputProps={{ step: 0.01, min: 0, max: 1 }}
                helperText="Maximum price to buy at"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sell Target Price"
                type="number"
                value={config.sell_price}
                onChange={(e) => handleConfigChange('sell_price', parseFloat(e.target.value))}
                inputProps={{ step: 0.01, min: 0, max: 1 }}
                helperText="Target price to sell at"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stop Loss Price"
                type="number"
                value={config.stop_loss_price}
                onChange={(e) => handleConfigChange('stop_loss_price', parseFloat(e.target.value))}
                inputProps={{ step: 0.01, min: 0, max: 1 }}
                helperText="Price to trigger stop loss"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trade Amount (USD)"
                type="number"
                value={config.fixed_trade_amount}
                onChange={(e) => handleConfigChange('fixed_trade_amount', parseFloat(e.target.value))}
                inputProps={{ step: 0.5, min: 1, max: 100 }}
                helperText="Amount per trade"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Min Wait Time</InputLabel>
                <Select
                  value={config.min_elapsed_minutes}
                  label="Min Wait Time"
                  onChange={(e) => handleConfigChange('min_elapsed_minutes', e.target.value)}
                >
                  <MenuItem value={5}>5 minutes</MenuItem>
                  <MenuItem value={8}>8 minutes</MenuItem>
                  <MenuItem value={10}>10 minutes</MenuItem>
                  <MenuItem value={12}>12 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.enable_btc_trading}
                    onChange={(e) => handleConfigChange('enable_btc_trading', e.target.checked)}
                  />
                }
                label="Enable BTC Trading"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.enable_eth_trading}
                    onChange={(e) => handleConfigChange('enable_eth_trading', e.target.checked)}
                  />
                }
                label="Enable ETH Trading"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.use_market_orders_for_sell}
                    onChange={(e) => handleConfigChange('use_market_orders_for_sell', e.target.checked)}
                  />
                }
                label="Use Market Orders for Sell"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveConfig} 
            variant="contained" 
            startIcon={<SaveIcon />}
          >
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction === 'restart' && 'Are you sure you want to restart the trading bot? This will interrupt any active trades.'}
            {confirmAction === 'stop' && 'Are you sure you want to stop the trading bot? This will cancel all pending orders.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleExecuteAction} 
            color={confirmAction === 'stop' ? 'error' : 'warning'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BotControls;