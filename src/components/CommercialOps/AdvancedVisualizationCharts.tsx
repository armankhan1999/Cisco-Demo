'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap } from 'recharts';

interface AdvancedVisualizationChartsProps {
  chartType: 'composed' | 'scatter' | 'radar' | 'treemap' | 'sankey' | 'correlation';
  data: any[];
  title: string;
  description?: string;
}

export default function AdvancedVisualizationCharts({ chartType, data, title, description }: AdvancedVisualizationChartsProps) {
  
  const renderComposedChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="volume" fill="#3B82F6" name="Volume" />
        <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10B981" strokeWidth={3} name="Efficiency %" />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderScatterChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" name="Deal Size ($K)" />
        <YAxis dataKey="y" name="Cycle Time (Days)" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Deals" fill="#8B5CF6" />
      </ScatterChart>
    </ResponsiveContainer>
  );

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar name="Performance" dataKey="score" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} strokeWidth={2} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );

  const renderTreemapChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={data}
        dataKey="value"
        stroke="#fff"
        fill="#3B82F6"
      />
    </ResponsiveContainer>
  );

  const renderCorrelationMatrix = () => (
    <div className="grid grid-cols-4 gap-2 h-96">
      {data.map((row, i) => 
        row.values.map((value: number, j: number) => (
          <div 
            key={`${i}-${j}`}
            className="flex items-center justify-center text-white text-xs font-medium rounded"
            style={{ 
              backgroundColor: `rgba(59, 130, 246, ${Math.abs(value)})`,
              minHeight: '60px'
            }}
          >
            {value.toFixed(2)}
          </div>
        ))
      )}
    </div>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'composed':
        return renderComposedChart();
      case 'scatter':
        return renderScatterChart();
      case 'radar':
        return renderRadarChart();
      case 'treemap':
        return renderTreemapChart();
      case 'correlation':
        return renderCorrelationMatrix();
      default:
        return renderComposedChart();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      
      <div className="w-full">
        {renderChart()}
      </div>
      
      {/* Chart Legend/Explanation */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {chartType === 'composed' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Volume represents transaction count</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-green-500 rounded"></div>
                <span>Efficiency shows performance percentage</span>
              </div>
            </>
          )}
          {chartType === 'scatter' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span>Each dot represents a deal</span>
              </div>
              <div className="text-gray-600">
                <span>Correlation shows relationship between deal size and cycle time</span>
              </div>
            </>
          )}
          {chartType === 'radar' && (
            <div className="col-span-2 text-gray-600">
              <span>Performance metrics scaled 0-100. Larger area indicates better overall performance.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
