import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ShowChart as ChartIcon,
} from '@mui/icons-material';

const TradeHistory = ({ tradeHistory, isLoading }) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const trades = tradeHistory?.trades || [];
  const totalTrades = tradeHistory?.total || 0;

  // Calculate statistics
  const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
  const winningTrades = trades.filter(trade => trade.profit > 0).length;
  const losingTrades = trades.filter(trade => trade.profit < 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(1) : 0;

  // Group trades by market
  const tradesByMarket = trades.reduce((acc, trade) => {
    const market = trade.market || 'Unknown';
    if (!acc[market]) acc[market] = [];
    acc[market].push(trade);
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trade History
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Historical trading performance and statistics.
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Trades</Typography>
              </Box>
              <Typography variant="h3" align="center">
                {totalTrades}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MoneyIcon color={totalProfit >= 0 ? 'success' : 'error'} sx={{ mr: 1 }} />
                <Typography variant="h6">Total Profit</Typography>
              </Box>
              <Typography 
                variant="h3" 
                align="center"
                color={totalProfit >= 0 ? 'success.main' : 'error.main'}
              >
                ${totalProfit.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Win Rate</Typography>
              </Box>
              <Typography variant="h3" align="center" color="success.main">
                {winRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {winningTrades}W / {losingTrades}L
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Trade</Typography>
              </Box>
              <Typography variant="h3" align="center">
                ${totalTrades > 0 ? (totalProfit / totalTrades).toFixed(2) : '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trade History Table - FIXED with horizontal scroll */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Trades
          </Typography>
          {trades.length > 0 ? (
            <Box sx={{ overflowX: 'auto', maxWidth: '100%' }}>
              <TableContainer component={Paper} variant="outlined" sx={{ minWidth: 800 }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 120 }}>Trade ID</TableCell>
                      <TableCell sx={{ minWidth: 100 }}>Market</TableCell>
                      <TableCell align="right" sx={{ minWidth: 90 }}>Price</TableCell>
                      <TableCell align="right" sx={{ minWidth: 100 }}>Shares</TableCell>
                      <TableCell align="right" sx={{ minWidth: 90 }}>Cost</TableCell>
                      <TableCell align="right" sx={{ minWidth: 100 }}>Profit</TableCell>
                      <TableCell sx={{ minWidth: 90 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trades.slice(0, 20).map((trade, index) => {
                      const cost = trade.price * trade.shares;
                      return (
                        <TableRow key={index} hover>
                          <TableCell sx={{ minWidth: 120 }}>
                            <Typography variant="body2" fontFamily="monospace" noWrap>
                              {trade.trade_id?.substring(0, 8)}...
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ minWidth: 100 }}>
                            <Chip
                              label={trade.market}
                              size="small"
                              color={trade.market.includes('UP') ? 'primary' : 'secondary'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: 90 }}>
                            <Typography variant="body2" noWrap>
                              ${trade.price.toFixed(3)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: 100 }}>
                            <Typography variant="body2" noWrap>
                              {trade.shares.toFixed(4)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: 90 }}>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              ${cost.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: 100 }}>
                            <Box display="flex" alignItems="center" justifyContent="flex-end">
                              {trade.profit >= 0 ? (
                                <TrendingUpIcon color="success" fontSize="small" />
                              ) : (
                                <TrendingDownIcon color="error" fontSize="small" />
                              )}
                              <Typography
                                variant="body2"
                                color={trade.profit >= 0 ? 'success.main' : 'error.main'}
                                fontWeight="medium"
                                sx={{ ml: 0.5 }}
                                noWrap
                              >
                                ${trade.profit.toFixed(2)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ minWidth: 90 }}>
                            <Chip
                              label={trade.profit >= 0 ? 'WIN' : 'LOSS'}
                              size="small"
                              color={trade.profit >= 0 ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Alert severity="info">
              No trade history available. The bot may not have executed any trades yet.
            </Alert>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Showing {Math.min(trades.length, 20)} of {totalTrades} trades
            {tradeHistory?.lastUpdated && ` • Last updated: ${new Date(tradeHistory.lastUpdated).toLocaleString()}`}
          </Typography>
        </CardContent>
      </Card>

      {/* Market Performance Breakdown */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance by Market
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(tradesByMarket).map(([market, marketTrades]) => {
              const marketProfit = marketTrades.reduce((sum, trade) => sum + trade.profit, 0);
              const marketWinRate = marketTrades.filter(t => t.profit > 0).length / marketTrades.length * 100;
              
              return (
                <Grid item xs={12} sm={6} md={3} key={market}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {market}
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Trades:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {marketTrades.length}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Profit:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          color={marketProfit >= 0 ? 'success.main' : 'error.main'}
                        >
                          ${marketProfit.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Win Rate:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {marketWinRate.toFixed(1)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Trading Insights */}
      {trades.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trading Insights
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Alert severity="info" icon={<TrendingUpIcon />}>
                  <Typography variant="subtitle2" gutterBottom>
                    Best Performing Market
                  </Typography>
                  {(() => {
                    const bestMarket = Object.entries(tradesByMarket).reduce((best, [market, trades]) => {
                      const profit = trades.reduce((sum, t) => sum + t.profit, 0);
                      return profit > best.profit ? { market, profit } : best;
                    }, { market: 'None', profit: -Infinity });
                    
                    return (
                      <Typography variant="body2">
                        {bestMarket.market}: ${bestMarket.profit.toFixed(2)} profit
                      </Typography>
                    );
                  })()}
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <Alert severity="warning" icon={<TrendingDownIcon />}>
                  <Typography variant="subtitle2" gutterBottom>
                    Worst Performing Market
                  </Typography>
                  {(() => {
                    const worstMarket = Object.entries(tradesByMarket).reduce((worst, [market, trades]) => {
                      const profit = trades.reduce((sum, t) => sum + t.profit, 0);
                      return profit < worst.profit ? { market, profit } : worst;
                    }, { market: 'None', profit: Infinity });
                    
                    return (
                      <Typography variant="body2">
                        {worstMarket.market}: ${worstMarket.profit.toFixed(2)} profit
                      </Typography>
                    );
                  })()}
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TradeHistory;