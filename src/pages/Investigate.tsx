import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SeverityBadge } from '@/components/soc/SeverityBadge';
import { VerdictBadge } from '@/components/soc/VerdictBadge';
import { RiskScoreGauge } from '@/components/soc/RiskScoreGauge';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Loader2,
  ChevronDown,
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  Code,
  Plus,
} from 'lucide-react';
import { EmailAnalysisData, computeSeverity, getVerdictFromString } from '@/types/soc';

// Mock response for demo
const mockAnalysisResponse: EmailAnalysisData = {
  risk: {
    score: 0.78,
    verdict: 'SUSPICIOUS',
    reasons: [
      'Contains urgency language',
      'External sender with similar internal domain',
      'Link redirects to unknown destination',
    ],
  },
  nlp_analysis: {
    available: true,
    signals: ['urgency', 'action_required'],
  },
  url_analysis: {
    score: 0.65,
    signals: ['redirect chain', 'newly registered domain'],
  },
  email_text_analysis: {
    score: 0.5,
    signals: ['request for action'],
  },
  malware_analysis: {
    detected: false,
  },
};

export default function Investigate() {
  const [emailContent, setEmailContent] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<EmailAnalysisData | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setAnalysisResult(mockAnalysisResponse);
    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setEmailContent('');
    setSenderEmail('');
    setSubjectLine('');
    setAnalysisResult(null);
  };

  const severity = analysisResult ? computeSeverity(analysisResult.risk.score) : null;
  const verdict = analysisResult ? getVerdictFromString(analysisResult.risk.verdict) : null;

  return (
    <div className="space-y-6 animate-slide-in max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Investigate</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manual email analysis for retrospective checks and experimentation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="soc-card">
          <h2 className="soc-card-header">Email Input</h2>
          
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender" className="text-muted-foreground">Sender Email</Label>
                <Input
                  id="sender"
                  placeholder="sender@example.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="bg-muted/30 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-muted-foreground">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  className="bg-muted/30 border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-muted-foreground">Email Body / Headers</Label>
              <Textarea
                id="content"
                placeholder="Paste the email content, headers, or raw email data here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[200px] bg-muted/30 border-border font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={!emailContent.trim() || isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze Email
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {analysisResult && severity && verdict ? (
            <>
              {/* Summary */}
              <div className="soc-card">
                <h2 className="soc-card-header">Analysis Result</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={severity} />
                    <VerdictBadge verdict={verdict} />
                  </div>

                  <RiskScoreGauge score={analysisResult.risk.score} size="lg" />

                  <Separator />

                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Findings</span>
                    <ul className="mt-2 space-y-1">
                      {analysisResult.risk.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-severity-warm shrink-0 mt-0.5" />
                          <span className="text-foreground">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Signal Breakdown */}
              <div className="soc-card">
                <h2 className="soc-card-header">Signal Breakdown</h2>
                <div className="mt-4 space-y-4">
                  {analysisResult.nlp_analysis.available && (
                    <div>
                      <span className="text-xs text-muted-foreground">NLP Signals</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {analysisResult.nlp_analysis.signals.map((signal, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {signal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">URL Analysis</span>
                      <span className="text-xs font-mono">
                        {Math.round(analysisResult.url_analysis.score * 100)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysisResult.url_analysis.signals.map((signal, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground">Malware Status</span>
                    <div className="mt-2 flex items-center gap-2">
                      {analysisResult.malware_analysis.detected ? (
                        <>
                          <ShieldX className="h-4 w-4 text-severity-hot" />
                          <span className="text-sm text-severity-hot">Malware detected</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 text-severity-cold" />
                          <span className="text-sm text-severity-cold">No malware detected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="soc-card">
                <h2 className="soc-card-header">Actions</h2>
                <div className="mt-4">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Promote to Alert
                  </Button>
                </div>
              </div>

              {/* Raw JSON (Collapsible) */}
              <Collapsible open={showRawJson} onOpenChange={setShowRawJson}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Raw JSON Response
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showRawJson ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="mt-2 p-4 bg-muted/30 rounded-lg text-xs font-mono overflow-x-auto">
                    {JSON.stringify({ success: true, data: analysisResult }, null, 2)}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            </>
          ) : (
            <div className="soc-card flex items-center justify-center h-64">
              <div className="text-center">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Paste email content and click Analyze to see results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
