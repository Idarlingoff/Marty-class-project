import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import HomePage from './HomePage';
import SetupGamePage from '../features/presenter/SetupGamePage';
import PresenterDashboardPage from '../features/presenter/PresenterDashboardPage';
import ResultsPage from '../features/presenter/ResultsPage';
import TeamSelectPage from '../features/team/TeamSelectPage';
import TeamGamePage from '../features/team/TeamGamePage';

const AppRouter: React.FC = () => (
  <HashRouter>
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/presenter" element={<SetupGamePage />} />
        <Route path="/presenter/dashboard/:gameId" element={<PresenterDashboardPage />} />
        <Route path="/presenter/results/:gameId" element={<ResultsPage />} />
        <Route path="/team" element={<TeamSelectPage />} />
        <Route path="/team/:teamNumber" element={<TeamGamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  </HashRouter>
);

export default AppRouter;
