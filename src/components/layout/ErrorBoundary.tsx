import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const IS_DEV = import.meta.env.DEV;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * PRODUCTION-GRADE ERROR BOUNDARY
 * Prevents "White Screen of Death" by catching runtime errors in the component tree.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`CRITICAL UI ERROR [${this.props.name || 'Global'}]:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10 font-sans">
          <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>

            <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Something Went Wrong</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-10 leading-relaxed">
              A critical rendering error occurred in the <span className="text-rose-400">{this.props.name || 'Core'}</span> subsystem. Mission control has been notified.
            </p>

            <div className="space-y-4 relative z-10">
                <Button 
                    onClick={this.handleReset}
                    className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-600/20"
                >
                    <RefreshCcw className="w-4 h-4 mr-3" /> Re-initialize System
                </Button>
                <Button 
                    variant="ghost"
                    onClick={this.handleGoHome}
                    className="w-full h-16 rounded-2xl border border-white/5 bg-white/5 text-slate-400 hover:text-white font-black uppercase tracking-widest text-[10px]"
                >
                    <Home className="w-4 h-4 mr-3" /> Return to Command
                </Button>
            </div>
            
            {(IS_DEV || window.location.search.includes('debug=true')) && (
                <div className="mt-8 p-4 bg-black/40 rounded-xl text-left border border-white/5 overflow-auto max-h-40">
                    <pre className="text-[9px] font-mono text-rose-300/60 leading-tight">
                        {this.state.error?.stack}
                    </pre>
                </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
