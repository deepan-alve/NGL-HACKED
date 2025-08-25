#!/usr/bin/env python3
"""
NGL Clone - Backend API for Security Demonstration

This API serves as the backend for the NGL clone cybersecurity demonstration.
In a real phishing attack, this would handle data collection, user tracking,
and potentially more malicious activities.

EDUCATIONAL PURPOSE ONLY - For cybersecurity research and awareness training.

Author: Deepan (Educational/Research purposes)
"""

import os
import json
import logging
from http.server import HTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

# Configure logging for research/demo purposes
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class SecurityDemoAPIHandler(SimpleHTTPRequestHandler):
    """
    API handler demonstrating how malicious actors might collect data
    from users who believe they're using a legitimate anonymous platform.
    """
    
    def do_GET(self):
        """Handle GET requests - demonstrate API endpoints that could collect data."""
        
        if self.path == '/health':
            self.send_json_response(200, {
                'status': 'active', 
                'message': 'Security demonstration API is running',
                'purpose': 'Educational cybersecurity research'
            })
            
        elif self.path == '/run-script':
            # Simulate the initialization endpoint that the frontend calls
            self.log_demo_activity("Script initialization requested")
            self.send_json_response(200, {
                'status': 'initialized',
                'message': 'Demo environment ready',
                'timestamp': datetime.now().isoformat()
            })
            
        else:
            self.send_json_response(404, {
                'error': 'Endpoint not found',
                'note': 'This is a cybersecurity demonstration'
            })
    
    def do_POST(self):
        """Handle POST requests - simulate message collection endpoints."""
        
        if self.path == '/collect-message':
            # In a real attack, this would collect and store user messages
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            self.log_demo_activity(f"Message collection simulated: {len(post_data)} bytes")
            
            self.send_json_response(200, {
                'status': 'collected',
                'message': 'Data captured for demonstration',
                'note': 'This is educational - no real data harvesting'
            })
        else:
            self.send_json_response(404, {'error': 'Unknown endpoint'})
    
    def send_json_response(self, status_code, data):
        """Send JSON response with appropriate headers."""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode())
    
    def log_demo_activity(self, message):
        """Log demonstration activity for educational analysis."""
        logging.info(f"[SECURITY DEMO] {message}")
        # In educational context, you might want to show this to demonstrate
        # how attackers could log and track user interactions

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    
    print("=" * 60)
    print("NGL CLONE - CYBERSECURITY DEMONSTRATION API")
    print("=" * 60)
    print(f"Starting security demo API on port {port}")
    print("PURPOSE: Educational cybersecurity research only")
    print("WARNING: This demonstrates potential attack vectors")
    print("=" * 60)
    
    server = HTTPServer(('', port), SecurityDemoAPIHandler)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down security demonstration API...")
        server.shutdown()
