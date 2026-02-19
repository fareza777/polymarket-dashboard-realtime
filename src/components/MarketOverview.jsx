import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
} from '@mui/icons-material';
import { useWebSocket } from '../contexts/WebSocketContext';

// Add CSS for pulse animation
const styles = `
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}
`;

const MarketOverview = ({ marketData, isLoading, isLive }) => {
  const { getTimeRemaining, lastUpdate } = useWebSocket();
  const [timeRemaining, setTimeRemaining] = useState('--:--');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // Add style tag for animations
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Update time remaining every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  // Update last update time when new data arrives
  useEffect(() => {
    if (lastUpdate) {
      setLastUpdateTime(new Date(lastUpdate));
    }
  }, [lastUpdate]);
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!marketData?.markets) {
    return (
      <Alert severity="info">
        No market data available. Please check if the bot is running and connected to Polymarket API.
      </Alert>
    );
  }

  // Group markets by cryptocurrency
  const groupedMarkets = {
    BTC: marketData.markets.filter(m => m.symbol.includes('BTC')),
    ETH: marketData.markets.filter(m => m.symbol.includes('ETH')),
    SOL: marketData.markets.filter(m => m.symbol.includes('SOL')),
    XRP: marketData.markets.filter(m => m.symbol.includes('XRP')),
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Market Overview
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip 
            label={isLive ? "LIVE" : "POLLING"} 
            color={isLive ? "success" : "warning"}
            icon={isLive ? <WifiIcon /> : <WifiOffIcon />}
            size="small"
          />
          <Chip 
            label={`Next: ${timeRemaining}`}
            color="info"
            icon={<AccessTimeIcon />}
            size="small"
          />
          {lastUpdateTime && (
            <Typography variant="caption" color="text.secondary">
              Updated: {lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {isLive 
          ? "🔴 LIVE WebSocket connection - Real-time market updates every 5 seconds" 
          : "📡 Polling API connection - Market updates every 5 seconds"}
      </Typography>

      {/* Market Period Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" gutterBottom>
                Current Trading Period
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {marketData.period || '15-minute'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Period End: {marketData.periodEnd ? new Date(marketData.periodEnd).toLocaleTimeString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" gutterBottom>
                Time Remaining
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {timeRemaining}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Next period starts in
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" gutterBottom>
                Market Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Markets: {marketData.markets.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Update: {marketData.timestamp ? new Date(marketData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Market Tables by Cryptocurrency */}
      {Object.entries(groupedMarkets).map(([crypto, markets]) => (
        markets.length > 0 && (
          <Card key={crypto} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {crypto} Markets
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Contract</TableCell>
                      <TableCell align="right">Bid Price</TableCell>
                      <TableCell align="right">Ask Price</TableCell>
                      <TableCell align="right">Spread</TableCell>
                      <TableCell align="right">Implied Probability</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {markets.map((market, index) => {
                      const spread = market.ask - market.bid;
                      const midPrice = (market.bid + market.ask) / 2;
                      const impliedProb = market.symbol.includes('UP') ? midPrice * 100 : (1 - midPrice) * 100;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {market.symbol}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end">
                              <Typography variant="body2" fontWeight="medium">
                                ${market.bid.toFixed(3)}
                              </Typography>
                              {isLive && (
                                <Box 
                                  sx={{ 
                                    width: 6, 
                                    height: 6, 
                                    borderRadius: '50%', 
                                    bgcolor: 'success.main',
                                    ml: 0.5,
                                    animation: 'pulse 1.5s infinite'
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end">
                              <Typography variant="body2" fontWeight="medium">
                                ${market.ask.toFixed(3)}
                              </Typography>
                              {isLive && (
                                <Box 
                                  sx={{ 
                                    width: 6, 
                                    height: 6, 
                                    borderRadius: '50%', 
                                    bgcolor: 'success.main',
                                    ml: 0.5,
                                    animation: 'pulse 1.5s infinite'
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">
                              ${spread.toFixed(3)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="primary" fontWeight="medium">
                              {impliedProb.toFixed(1)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
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
                                {market.change >= 0 ? '+' : ''}{market.change.toFixed(3)}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Market Summary */}
              {markets.length === 2 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Arbitrage Opportunity:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {markets[0].bid + markets[1].bid < 0.99 ? 'YES' : 'NO'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Probability:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {((markets[0].bid + markets[1].bid) * 100).toFixed(1)}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        )
      ))}

      {/* Trading Insights */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Trading Insights
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="body2" color="primary.contrastText">
                  Best Bid
                </Typography>
                <Typography variant="h6" color="primary.contrastText">
                  ${Math.max(...marketData.markets.map(m => m.bid)).toFixed(3)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}>
                <Typography variant="body2" color="secondary.contrastText">
                  Lowest Ask
                </Typography>
                <Typography variant="h6" color="secondary.contrastText">
                  ${Math.min(...marketData.markets.map(m => m.ask)).toFixed(3)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="body2" color="success.contrastText">
                  Avg Spread
                </Typography>
                <Typography variant="h6" color="success.contrastText">
                  ${(marketData.markets.reduce((sum, m) => sum + (m.ask - m.bid), 0) / marketData.markets.length).toFixed(3)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2" color="warning.contrastText">
                  Active Markets
                </Typography>
                <Typography variant="h6" color="warning.contrastText">
                  {marketData.markets.filter(m => m.bid > 0.01).length}/{marketData.markets.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MarketOverview;