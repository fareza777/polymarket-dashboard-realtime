import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const Dashboard = ({ botStatus, marketData, tradeHistory, healthLogs, isLoading }) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Real-time monitoring of Polymarket trading bot performance and market conditions.
      </Typography>

      {/* Bot Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SpeedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Bot Status</Typography>
              </Box>
              <Chip
                label={botStatus?.running ? 'RUNNING' : 'STOPPED'}
                color={botStatus?.running ? 'success' : 'error'}
                icon={botStatus?.running ? <CheckCircleIcon /> : <WarningIcon />}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                PID: {botStatus?.pid || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uptime: {botStatus?.uptime || 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SpeedIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="h6">CPU Usage</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h4">{botStatus?.cpuPercent || 0}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={botStatus?.cpuPercent || 0}
                color={botStatus?.cpuPercent > 80 ? 'error' : botStatus?.cpuPercent > 50 ? 'warning' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MemoryIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="h6">Memory Usage</Typography>
              </Box>
              <Typography variant="h4">{botStatus?.memoryMB || 0} MB</Typography>
              <Typography variant="body2" color="text.secondary">
                Working Set
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TimeIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Trades</Typography>
              </Box>
              <Typography variant="h4">{tradeHistory?.total || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                {tradeHistory?.trades?.length || 0} recent trades
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Market Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Overview
              </Typography>
              {marketData?.markets && marketData.markets.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Market</TableCell>
                        <TableCell align="right">Bid</TableCell>
                        <TableCell align="right">Ask</TableCell>
                        <TableCell align="right">Change</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {marketData.markets.map((market, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {market.symbol}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              ${market.bid.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              ${market.ask.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end">
                              {market.change >= 0 ? (
                                <TrendingUpIcon color="success" fontSize="small" />
                              ) : (
                                <TrendingDownIcon color="error" fontSize="small" />
                              )}
                              <Typography
                                variant="body2"
                                color={market.change >= 0 ? 'success.main' : 'error.main'}
                                sx={{ ml: 0.5 }}
                              >
                                {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={market.bid > 0.5 ? 'Active' : 'Inactive'}
                              size="small"
                              color={market.bid > 0.5 ? 'success' : 'default'}
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No market data available</Alert>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Last updated: {marketData?.timestamp ? new Date(marketData.timestamp).toLocaleTimeString() : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Trades & Health Logs */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Trades
              </Typography>
              {tradeHistory?.trades && tradeHistory.trades.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Market</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Shares</TableCell>
                        <TableCell align="right">Profit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tradeHistory.trades.slice(0, 5).map((trade, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2">{trade.market}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">${trade.price.toFixed(2)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">{trade.shares.toFixed(4)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={trade.profit >= 0 ? 'success.main' : 'error.main'}
                              fontWeight="medium"
                            >
                              ${trade.profit.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No recent trades</Alert>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Total trades: {tradeHistory?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Check Logs
              </Typography>
              {healthLogs?.logs && healthLogs.logs.length > 0 ? (
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {healthLogs.logs.map((log, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                          {log.timestamp}
                        </Typography>
                        <Chip
                          label={log.level.toUpperCase()}
                          size="small"
                          color={log.level === 'error' ? 'error' : log.level === 'warning' ? 'warning' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {log.message}
                      </Typography>
                      {index < healthLogs.logs.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">No health logs available</Alert>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Last check: {healthLogs?.lastCheck || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;