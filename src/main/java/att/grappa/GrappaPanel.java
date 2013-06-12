/*
 *  This software may only be used by you under license from AT&T Corp.
 *  ("AT&T").  A copy of AT&T's Source Code Agreement is available at
 *  AT&T's Internet website having the URL:
 *  <http://www.research.att.com/sw/tools/graphviz/license/source.html>
 *  If you received this software without first entering into a license
 *  with AT&T, you have an infringing copy of this software and cannot use
 *  it without violating AT&T's intellectual property rights.
 */

package att.grappa;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Composite;
import java.awt.Container;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.Shape;
import java.awt.Stroke;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;
import java.awt.geom.AffineTransform;
import java.awt.geom.Dimension2D;
import java.awt.geom.NoninvertibleTransformException;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.awt.print.PageFormat;
import java.awt.print.Printable;
import java.awt.print.PrinterException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.StringTokenizer;

import javax.swing.JLabel;
import javax.swing.JViewport;
import javax.swing.SwingUtilities;
import javax.swing.event.AncestorEvent;
import javax.swing.event.AncestorListener;
import javax.swing.event.PopupMenuEvent;
import javax.swing.event.PopupMenuListener;

/**
 * A class used for drawing the graph.
 *
 * @version 1.2, ; Copyright 1996 - 2010 by AT&T Corp.
 * @author  <a href="mailto:john@research.att.com">John Mocenigo</a>, <a href="http://www.research.att.com">Research @ AT&T Labs</a>
 */
public class GrappaPanel extends javax.swing.JPanel
    implements att.grappa.GrappaConstants, ComponentListener,
		AncestorListener, PopupMenuListener,
		MouseListener, MouseMotionListener, MouseWheelListener,
		Printable,  Runnable {
    Graph graph;
    Subgraph subgraph;
    GrappaBacker backer;
    boolean nodeLabels, edgeLabels, subgLabels;
    AffineTransform transform = null;
    AffineTransform oldTransform = null;
    AffineTransform inverseTransform = null;
    int nextElement = -1;
    boolean scaleToFit = false;
    GrappaSize scaleToSize = null;
    GrappaListener grappaListener = null;

    private Element pressedElement = null;
    private GrappaPoint pressedPoint = null;
    private int pressedModifiers = 0;
    private GrappaStyle selectionStyle = null;
    private GrappaStyle deletionStyle = null;
    private double scaleFactor = 1;
    private double scaleInfo = 1;
    private GrappaBox outline = null;
    private GrappaBox savedOutline = null;
    private GrappaBox zoomBox = null;
    private boolean inMenu = false;
    private boolean scaleChanged = false;
    private boolean paintActive = false;
    private Dimension prevsz = null;

    private Point2D panelcpt = null;
    JLabel surrogateLabel;
    private double mouseWheelFactor = 2.0;
    private float edgeAlpha = 1.0f ;
    private boolean panMode = false;
    private Point panPoint = null;
    
    HashMap<Graph,java.util.List<SimplePolygon>> XDOTShapes = new HashMap<Graph,java.util.List<SimplePolygon>>() ;

    /**
     * Constructs a new canvas associated with a particular subgraph.
     * Keep in mind that Graph is a sub-class of Subgraph so that
     * usually a Graph object is passed to the constructor.
     *
     * @param subgraph the subgraph to be rendered on the canvas
     */
    public GrappaPanel(Subgraph subgraph) {
    	this(subgraph, null);
    }

    /**
     * Constructs a new canvas associated with a particular subgraph.
     *
     * @param subgraph the subgraph to be rendered on the canvas.
     * @param backer used to draw a background for the graph.
     */
    public GrappaPanel(Subgraph subgraph, GrappaBacker backer) {
    	super();
    	surrogateLabel = new JLabel() ;
    	this.subgraph = subgraph;
    	this.backer = backer;
    	this.graph = subgraph.getGraph();

    	addAncestorListener(this);
    	addComponentListener(this);

    	selectionStyle = (GrappaStyle)(graph.getGrappaAttributeValue(GRAPPA_SELECTION_STYLE_ATTR));
    	deletionStyle = (GrappaStyle)(graph.getGrappaAttributeValue(GRAPPA_DELETION_STYLE_ATTR));
    	
    	this.setDoubleBuffered(true);
    }

    /**
     * Adds the specified listener to receive mouse events from this graph.
     *
     * @param listener the event listener.
     * @return the previous event listener.
     *
     * @see GrappaAdapter
     */
    public GrappaListener addGrappaListener(GrappaListener listener) {
    	GrappaListener oldGL = grappaListener;
    	grappaListener = listener;
    	if(grappaListener == null) {
    		if (oldGL != null) {
    			removeMouseListener(this);
    			removeMouseMotionListener(this);
    			removeMouseWheelListener(this);
    		}
    		setToolTipText(null);
    	} else {
    		if (oldGL == null) {
    			addMouseListener(this);
    			addMouseMotionListener(this);
    			addMouseWheelListener(this);
    		}
    		String tip = graph.getToolTipText();
    		if(tip == null) {
    			tip = Grappa.getToolTipText();
    		}
    		setToolTipText(tip);
    	}
    	return(oldGL);
    }

    /**
     * Removes the current listener from this graph.
     * Equivalent to <TT>addGrappaListener(null)</TT>.
     *
     * @return the event listener just removed.
     */
    public GrappaListener removeGrappaListener() {
    	return(addGrappaListener(null));
    }

    public int print(Graphics g, PageFormat pf, int pi) throws PrinterException {
    	GrappaSize prevToSize = scaleToSize;
    	boolean prevToFit = scaleToFit;

    	if (pi >= 1) {
    		return Printable.NO_SUCH_PAGE;
    	}
    	try {
    		scaleToFit = false;
    		scaleToSize = new GrappaSize(pf.getImageableWidth(), pf.getImageableHeight());
    		((Graphics2D)g).translate(pf.getImageableX(), pf.getImageableY());
    		paintComponent(g);
    	}
    	finally {
    		scaleToSize = prevToSize;
    		scaleToFit = prevToFit;
    	}
    	return Printable.PAGE_EXISTS;
    }

    public synchronized void paintComponent(Graphics g) {
   // 	super.paintComponent(g) ; // cleans ghosts...
		Graphics2D g2d = (Graphics2D)g ;
//System.err.println( getClass().getName() + "::paintComponent(...)" ) ;
		Point2D cpt = null;
		g2d.setClip(g.getClip());
		if(Grappa.synchronizePaint || graph.getSynchronizePaint()) {
			if(graph.setPaint(true)) {
				cpt = componentPaint(g2d);
				graph.setPaint(false);
			}
		} else {
			cpt = componentPaint(g2d);
		}
		if (cpt != null) {
			setCPT(cpt);
//run();
//			EventQueue.invokeLater(this);
		}
    }

    void setCPT(Point2D cpt) {
    	panelcpt = cpt;
    }

    Point2D getCPT() {
    	return(panelcpt);
    }
    
    public void reset() {
    	try {
    		graph.reset();
    	} catch( Exception others ){
    		others.printStackTrace();
    	}
    	XDOTShapes.remove(graph) ;
    }
    
    private Point2D componentPaint(Graphics g) {
    	if(subgraph == null || !subgraph.reserve()) return(null);
    	Graphics2D g2d = (Graphics2D)g;
    	Container prnt;
    	Container tprnt;
    	Dimension nsz;

    	Point2D cpt = null;

    	//Color origBackground = g2d.getBackground();
    	////Composite origComposite = g2d.getComposite();
    	//Paint origPaint = g2d.getPaint();
    	//RenderingHints origRenderingHints = g2d.getRenderingHints();
    	//Stroke origStroke = g2d.getStroke();
    	//AffineTransform origAffineTransform = g2d.getTransform();
    	//Font origFont = g2d.getFont();

    	//elementVector = null;


    	GrappaBox bbox ;
    	bbox = new GrappaBox(subgraph.getBoundingBox());

    	if(bbox == null) return(null);

    	GrappaSize margins = (GrappaSize)(subgraph.getAttributeValue(MARGIN_ATTR));
    	double x_margin = 0;
    	double y_margin = 0;
    	if(margins != null) {
    		x_margin = PointsPerInch * margins.width;
    		y_margin = PointsPerInch * margins.height;

    		bbox.x -= x_margin;
    		bbox.y -= y_margin;
    		bbox.width += 2.0 * x_margin;
    		bbox.height += 2.0 * y_margin;
    	}

    	subgLabels = subgraph.getShowSubgraphLabels();
    	nodeLabels = subgraph.getShowNodeLabels();
    	edgeLabels = subgraph.getShowEdgeLabels();
    	if(Grappa.useAntiAliasing) {
    		g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);
    	} else {
    		g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_OFF);
    	}
    	if(Grappa.antiAliasText) {
    		g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
    	} else {
    		g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,RenderingHints.VALUE_TEXT_ANTIALIAS_OFF);
    	}
    	if(Grappa.useFractionalMetrics) {
    		g2d.setRenderingHint(RenderingHints.KEY_FRACTIONALMETRICS,RenderingHints.VALUE_FRACTIONALMETRICS_ON);
    	}
    	g2d.setStroke(GrappaStyle.defaultStroke);

    	oldTransform = transform;
    	transform = new AffineTransform();
    	if(scaleToFit || scaleToSize != null) {
    		scaleFactor = 1;
    		zoomBox = null;
    		double scaleToWidth = 0;
    		double scaleToHeight = 0;
    		if(scaleToFit) {
    			tprnt = prnt = getParent();
    			while (tprnt != null && !(tprnt instanceof javax.swing.JViewport))
    				tprnt = tprnt.getParent();
    			if (tprnt != null)
    				prnt = tprnt;
    			if(prnt instanceof javax.swing.JViewport) {
    				Dimension sz = ((javax.swing.JViewport)prnt).getSize();
    				scaleToWidth = sz.width;
    				scaleToHeight = sz.height;
    			} else {
    				Rectangle scaleTo = getVisibleRect();
    				scaleToWidth = scaleTo.width;
    				scaleToHeight = scaleTo.height;
    			}
    		} else {
    			scaleToWidth = scaleToSize.width;
    			scaleToHeight = scaleToSize.height;
    		}
    		double widthRatio = scaleToWidth / bbox.getWidth();
    		double heightRatio = scaleToHeight / bbox.getHeight();
    		double xTranslate = 0;
    		double yTranslate = 0;
    		if(widthRatio < heightRatio) {
    			xTranslate = (scaleToWidth -  widthRatio * bbox.getWidth()) / ( 2.0 * widthRatio);
    			yTranslate = (scaleToHeight -  widthRatio * bbox.getHeight()) / (2.0 * widthRatio);
    			transform.scale(widthRatio, widthRatio);
    			scaleInfo = widthRatio;
    		} else {
    			xTranslate = (scaleToWidth -  heightRatio * bbox.getWidth()) / (2.0 * heightRatio);
    			yTranslate = (scaleToHeight -  heightRatio * bbox.getHeight()) / (2.0 * heightRatio);
    			transform.scale(heightRatio, heightRatio);
    			scaleInfo = heightRatio;
    		}
    		transform.translate(xTranslate, yTranslate);
    		nsz = new Dimension((int)Math.ceil(scaleToWidth),(int)Math.ceil(scaleToHeight));
    		if (prevsz == null || prevsz.getWidth() != nsz.getWidth() || prevsz.getHeight() != nsz.getHeight()) {
    			setSize(nsz);
    			setPreferredSize(nsz);
    			prevsz = new Dimension(nsz.width, nsz.height);
    		}
    		transform.translate(-bbox.getMinX(),-bbox.getMinY());
    		scaleFactor = scaleInfo;
    	} else if(zoomBox != null) {
    		//System.err.println("zoombox");
    		Rectangle r;
    		tprnt = prnt = getParent();
    		while (tprnt != null && !(tprnt instanceof javax.swing.JViewport))
    			tprnt = tprnt.getParent();
    		if (tprnt != null)
    			prnt = tprnt;
    		if(prnt instanceof javax.swing.JViewport) {
    			Dimension sz = ((javax.swing.JViewport)prnt).getSize();
    			r = new Rectangle(0,0,sz.width,sz.height);
    		} else
    			r = getVisibleRect();
    		scaleFactor = 1;
    		if(zoomBox.width != 0 && zoomBox.height != 0 && oldTransform != null) {
    			//GrappaBox zb = new GrappaBox(oldTransform.createTransformedShape(zoomBox).getBounds2D());
    			double scaleToWidth = r.width;
    			double scaleToHeight = r.height;
    			double widthRatio = scaleToWidth / zoomBox.width;
    			double heightRatio = scaleToHeight / zoomBox.height;
    			if(widthRatio < heightRatio) {
    				scaleFactor = widthRatio;
    			} else {
    				scaleFactor = heightRatio;
    			}
    			transform.scale(scaleFactor, scaleFactor);
    			scaleInfo = scaleFactor;
    			//transform.translate(xTranslate, yTranslate);
    			scaleToWidth = bbox.getWidth() * scaleFactor;
    			scaleToHeight = bbox.getHeight() * scaleFactor;
    			nsz = new Dimension((int)Math.ceil(scaleToWidth),(int)Math.ceil(scaleToHeight));
    			if (prevsz == null || prevsz.getWidth() != nsz.getWidth() || prevsz.getHeight() != nsz.getHeight()) {
    				setSize(nsz);
    				setPreferredSize(nsz);
    				prevsz = new Dimension(nsz.width, nsz.height);
    			}
    			transform.translate(-bbox.getMinX(),-bbox.getMinY());
    			cpt = new Point2D.Double(zoomBox.getCenterX(), zoomBox.getCenterY());
    		}
    		zoomBox = null;
    		//System.err.println("scaleFactor="+scaleFactor);
    		//transform.scale(scaleFactor, scaleFactor);
    		//int w = (int)Math.ceil(bbox.getWidth()*scaleFactor);
    		//int h = (int)Math.ceil(bbox.getHeight()*scaleFactor);
    		//w = w < r.width ? r.width : w;
    		//h = h < r.height ? r.height : h;
    		//setSize(new Dimension(w,h));
    		//setPreferredSize(new Dimension(w,h));
    		scaleFactor = scaleInfo;
    	} else if(scaleFactor != 1) {
    		Rectangle r = getVisibleRect();

    		cpt = null;
    		prnt = null;

    		if(scaleChanged) {
    			tprnt = prnt = getParent();
    			while (tprnt != null && !(tprnt instanceof javax.swing.JViewport))
    				tprnt = tprnt.getParent();
    			if (tprnt != null)
    				prnt = tprnt;
    			if(prnt instanceof javax.swing.JViewport && inverseTransform != null) {
    				Point2D pt = new Point2D.Double(r.x,r.y);
    				cpt = new Point2D.Double(r.x+r.width,r.y+r.height);
    				inverseTransform.transform(pt,pt);
    				inverseTransform.transform(cpt,cpt);
    				cpt.setLocation(
    						pt.getX() + (cpt.getX() - pt.getX())/2.,
    						pt.getY() + (cpt.getY() - pt.getY())/2.
    				);
    			} else {
    				// to save checking again below
    				prnt = null;
    			}
    		}

    		transform.scale(scaleFactor, scaleFactor);
    		scaleInfo = scaleFactor;
    		int w = (int)Math.ceil(bbox.getWidth()*scaleFactor);
    		int h = (int)Math.ceil(bbox.getHeight()*scaleFactor);
    		w = w < r.width ? r.width : w;
    		h = h < r.height ? r.height : h;
    		nsz = new Dimension(w, h);
    		if (prevsz == null || prevsz.getWidth() != nsz.getWidth() || prevsz.getHeight() != nsz.getHeight()) {
    			setSize(nsz);
    			setPreferredSize(nsz);
    			prevsz = new Dimension(nsz.width, nsz.height);
    		}
    		transform.translate(-bbox.getMinX(),-bbox.getMinY());
    	} else {
    		cpt = null;
    		prnt = null;

    		if(scaleChanged) {
    			tprnt = prnt = getParent();
    			while (tprnt != null && !(tprnt instanceof javax.swing.JViewport))
    				tprnt = tprnt.getParent();
    			if (tprnt != null)
    				prnt = tprnt;
    			if(prnt instanceof javax.swing.JViewport && inverseTransform != null) {
    				Rectangle r = getVisibleRect();
    				Point2D pt = new Point2D.Double(r.x,r.y);
    				cpt = new Point2D.Double(r.x+r.width,r.y+r.height);
    				inverseTransform.transform(pt,pt);
    				inverseTransform.transform(cpt,cpt);
    				cpt.setLocation(
    						pt.getX() + (cpt.getX() - pt.getX())/2.,
    						pt.getY() + (cpt.getY() - pt.getY())/2.
    				);
    			} else {
    				// to save checking again below
    				prnt = null;
    			}
    		}
    		scaleInfo = 1;
    		nsz = new Dimension((int)Math.ceil(bbox.getWidth()),(int)Math.ceil(bbox.getHeight()));
    		if (prevsz == null || prevsz.getWidth() != nsz.getWidth() || prevsz.getHeight() != nsz.getHeight()) {
    			setSize(nsz);
    			setPreferredSize(nsz);
    			prevsz = new Dimension(nsz.width, nsz.height);
    		}
    		transform.translate(-bbox.getMinX(),-bbox.getMinY());

    	}

    	scaleChanged = false;

    	if(scaleInfo < Grappa.nodeLabelsScaleCutoff) {
    		nodeLabels = false;
    	}

    	if(scaleInfo < Grappa.edgeLabelsScaleCutoff) {
    		edgeLabels = false;
    	}

    	if(scaleInfo < Grappa.subgLabelsScaleCutoff) {
    		subgLabels = false;
    	}

    	try {
    		inverseTransform = transform.createInverse();
    	} catch(NoninvertibleTransformException nite) {
    		inverseTransform = null;
    		nite.printStackTrace();
    	}
    	//
    	// track cpt...
    	//
    	if( cpt != null ) {
    		boolean didRedraw = centerPanelAtPoint(cpt);
    		// short circuit the redraw....it WILL be redrawn as a side effect in centerPanelAtPoint(...).
    		if( didRedraw == true ) {
    			//
    			// optimize....
    			return null;
    		}
    	}
    	g2d.transform(transform);

    	Rectangle clip =  g2d.getClipBounds();
    	// grow bounds to account for Java's frugal definition of what
    	// constitutes the intersectable area of a shape
    	clip.x--;
    	clip.y--;
    	clip.width+=2;
    	clip.height+=2;

    	synchronized(graph) {

    		GrappaNexus grappaNexus = subgraph.grappaNexus;

    		if(grappaNexus != null) {

    			Color bkgdColor = null;

    			// do fill now in case there is a Backer supplied
    			g2d.setPaint(bkgdColor = (Color)(graph.getGrappaAttributeValue(GRAPPA_BACKGROUND_COLOR_ATTR)));
    			g2d.fill(clip);
    			//
    			// TODO Inject xdot polygons...nothing else supported yet ...
    			// 
    			java.util.List<SimplePolygon> xdotShapes = XDOTShapes.get( graph ) ;
    			if( xdotShapes == null ) {
    				xdotShapes = xdotExtractDrawAttrShapes( graph ) ;
    				XDOTShapes.put( graph, xdotShapes ) ;
    			}
    			if( xdotShapes.size() > 0 ) {
    				//System.err.println( bbox ) ;
    				g2d.translate( bbox.getMinX()+x_margin, bbox.getMinY()+y_margin ) ;
    				xdotPaintShapes( xdotShapes, g2d ) ;
    				g2d.translate( -(bbox.getMinX()+x_margin), -(bbox.getMinY()+y_margin) );
    			}
    			// End of chance...
    	    	
    			if(grappaNexus.style.filled || grappaNexus.image != null) {
    				if(grappaNexus.style.filled) {
    					if (grappaNexus.fillcolor != null) {
    						g2d.setPaint(bkgdColor = grappaNexus.fillcolor);
    						grappaNexus.fill(g2d);
    						if (grappaNexus.color != null)
    							g2d.setPaint(grappaNexus.color);
    						else
    							g2d.setPaint(grappaNexus.style.line_color);
    					} else {
    						g2d.setPaint(bkgdColor = grappaNexus.color);
    						grappaNexus.fill(g2d);
    						g2d.setPaint(grappaNexus.style.line_color);
    					}
    				}
    				grappaNexus.drawImage(g2d);
    				// for the main graph, only outline when filling/imaging
    				if(GrappaStyle.defaultStroke != grappaNexus.style.stroke) {
    					g2d.setStroke(grappaNexus.style.stroke);
    					grappaNexus.draw(g2d);
    					g2d.setStroke(GrappaStyle.defaultStroke);
    				} else {
    					grappaNexus.draw(g2d);
    				}
    			}
    			if(backer != null && Grappa.backgroundDrawing) {
    				backer.drawBackground(g2d, graph, bbox, clip);
    			}
    			paintSubgraph(g2d, subgraph, clip, bkgdColor);
    		}
    	}
    	subgraph.release();
    	return(cpt);
    }


    /**
     * Centers the panel at the supplied point.
     *
     * @param cpt requested center point
     *
     */
    public boolean centerPanelAtPoint(Point2D cpt) {
    	Container prnt, tprnt;
    	javax.swing.JViewport viewport;

    	tprnt = prnt = getParent();
    	while (tprnt != null && !(tprnt instanceof javax.swing.JViewport))
    		tprnt = tprnt.getParent();
    	if (tprnt != null)
    		prnt = tprnt;
    	if (prnt instanceof javax.swing.JViewport) {
    		viewport = (javax.swing.JViewport)prnt;
    		transform.transform(cpt,cpt);
    		Dimension viewsize = viewport.getExtentSize();
    		viewport.setViewPosition(
    				new Point((int)(cpt.getX() - ((double)viewsize.width)/2.),
    				(int)(cpt.getY() - ((double)viewsize.height)/2.)) );
    		return true;
    	} // else ...
    	return false;
    }

    /**
     * Get the AffineTransform that applies to this drawing.
     *
     * @return the AffineTransform that applies to this drawing.
     */
    public AffineTransform getTransform() {
	return (AffineTransform)(transform.clone());
    }

    /**
     * Get the inverse AffineTransform that applies to this drawing.
     *
     * @return the inverse AffineTransform that applies to this drawing.
     */
    public AffineTransform getInverseTransform() {
	return inverseTransform;
    }

    /**
     * Registers the default text to display in a tool tip.
     * Setting the default text to null turns off tool tips.
     * The default text is displayed when the mouse is outside the
     * graph boundaries, but within the panel.
     *
     * @see Graph#setToolTipText(String)
     */
    public void setToolTipText(String tip) {
	//System.err.println("tip set to: " + tip);
	super.setToolTipText(tip);
    }

    /**
     * Generate an appropriate tooltip based on the mouse location
     * provided by the given event.
     * @return if a GrappaListener is available, the result of its
     * <TT>grappaTip()</TT> method is returned, otherwise null.
     *
     * @see GrappaPanel#setToolTipText(String)
     */
    public String getToolTipText(MouseEvent mev) {
	if(inverseTransform == null || grappaListener == null) return(null);
	//System.err.println("tip requested");

	Point2D pt = inverseTransform.transform(mev.getPoint(),null);

	return(grappaListener.grappaTip(subgraph, findContainingElement(subgraph,pt), new GrappaPoint(pt.getX(), pt.getY()), mev.getModifiers(), this));
    }

    /**
     * Enable/disable scale-to-fit mode.
     *
     * @param setting if true, the graph drawing is scaled to fit the panel, otherwise the graph is drawn full-size.
     */
    public void setScaleToFit(boolean setting) {
	prevsz = null;
	scaleToFit = setting;
    }

    /**
     * Scale the graph drawing to a specific size.
     */
    public void setScaleToSize(Dimension2D scaleSize) {

	prevsz = null;
	if(scaleSize == null) {
	    scaleToSize = null;
	} else {
	    scaleToSize = new GrappaSize(scaleSize.getWidth(), scaleSize.getHeight());
	}
    }

    /**
     * Get the subgraph being drawn on this panel.
     *
     * @return the subgraph being drawn on this panel.
     */
    public Subgraph getSubgraph() {
	return(subgraph);
    }

    /**
     * Reset the scale factor to one.
     */
    public void resetZoom() {
    	scaleChanged = scaleFactor != 1;
    	scaleFactor = 1;
    	zoomBox = null;
    }

    /**
     * Check if a swept outline is still available.
     *
     * @return true if there is an outline available.
     */
    public boolean hasOutline() {
	return(savedOutline != null);
    }

    /**
     * Clear swept outline, if any.
     */
    public void clearOutline() {
	savedOutline = null;
    }

    /**
     * Zoom the drawing to the outline just swept with the mouse, if any.
     *
     * @return the box corresponding to the swept outline, or null.
     */
    public GrappaBox zoomToOutline() {
	zoomBox = null;
	if(savedOutline != null) {
	    scaleFactor = 1;
	    zoomBox = new GrappaBox(savedOutline);
	    savedOutline = null;
	}
	//System.err.println("zoomBox=" + zoomBox);
	return(zoomBox);
    }

    /**
     * Zoom the drawing to the outline just swept with the mouse, if any.
     *
     * @param outline the zoom bounds
     * @return the box corresponding to the swept outline, or null.
     */
    public GrappaBox zoomToOutline(GrappaBox outline) {
	zoomBox = null;
	if(outline != null) {
	    scaleFactor = 1;
	    zoomBox = new GrappaBox(outline);
	}
	return(zoomBox);
    }

    /**
     * Adjust the scale factor by the supplied multiplier.
     *
     * @param multiplier multiply the scale factor by this amount.
     * @return the value of the previous scale factor.
     */
    public double multiplyScaleFactor(double multiplier) {
    	double old = scaleFactor;
    	zoomBox = null;
    	scaleFactor *= multiplier;
    	if(scaleFactor == 0) scaleFactor = old;
    	scaleChanged = scaleFactor != old;
    	return(old);
    }
    
    public void setScaleFactor( double scaleFactor ) {
    	double old = this.scaleFactor;
    	zoomBox = null;
    	this.scaleFactor = scaleFactor ;
    	scaleChanged = scaleFactor != old;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    // Private methods
    //
    ////////////////////////////////////////////////////////////////////////

    private void paintSubgraph(Graphics2D g2d, Subgraph subg, Shape clipper, Color bkgdColor) {
    	if(subg != subgraph && !subg.reserve()) return;

    	Rectangle2D bbox = subg.getBoundingBox();
    	GrappaNexus grappaNexus = subg.grappaNexus;

    	if(bbox != null && grappaNexus != null && subg.visible && !grappaNexus.style.invis && clipper.intersects(bbox)) {
    		int i;

    		if(subg != subgraph) {
    			g2d.setPaint(grappaNexus.color);
    			if(grappaNexus.style.filled) {
    				if (grappaNexus.fillcolor != null) {
    					bkgdColor = grappaNexus.fillcolor;
    					grappaNexus.fill(g2d);
    					if (grappaNexus.color != null)
    						g2d.setPaint(grappaNexus.color);
    					else
    						g2d.setPaint(grappaNexus.style.line_color);
    				} else {
    					bkgdColor = grappaNexus.color;
    					grappaNexus.fill(g2d);
    					g2d.setPaint(grappaNexus.style.line_color);
    				}
    			} else if(grappaNexus.color == bkgdColor) { // using == is OK (caching)
    				g2d.setPaint(grappaNexus.style.line_color);
    			}
    			grappaNexus.drawImage(g2d);
    			if(subg.isCluster() || Grappa.outlineSubgraphs) {
    				if(GrappaStyle.defaultStroke != grappaNexus.style.stroke) {
    					g2d.setStroke(grappaNexus.style.stroke);
    					grappaNexus.draw(g2d);
    					g2d.setStroke(GrappaStyle.defaultStroke);
    				} else {
    					grappaNexus.draw(g2d);
    				}
    			}
    		}

    		if((subg.highlight&DELETION_MASK) == DELETION_MASK) {
    			g2d.setPaint(deletionStyle.line_color);
    			if(GrappaStyle.defaultStroke != deletionStyle.stroke) {
    				g2d.setStroke(deletionStyle.stroke);
    				grappaNexus.draw(g2d);
    				g2d.setStroke(GrappaStyle.defaultStroke);
    			} else {
    				grappaNexus.draw(g2d);
    			}
    		} else if((subg.highlight&SELECTION_MASK) == SELECTION_MASK) {
    			g2d.setPaint(selectionStyle.line_color);
    			if(GrappaStyle.defaultStroke != selectionStyle.stroke) {
    				g2d.setStroke(selectionStyle.stroke);
    				grappaNexus.draw(g2d);
    				g2d.setStroke(GrappaStyle.defaultStroke);
    			} else {
    				grappaNexus.draw(g2d);
    			}
    		}

    		if(grappaNexus.lstr != null && subgLabels) {
    			g2d.setFont(grappaNexus.font);
    			g2d.setPaint(grappaNexus.font_color);
    			for(i = 0; i < grappaNexus.lstr.length; i++) {
    				if( grappaNexus.lstr[i] != null && grappaNexus.lstr[i].length() > 0 ) {
    					if( grappaNexus.lstr[i].charAt(0)=='<' &&
    							grappaNexus.lstr[i].charAt(grappaNexus.lstr[i].length()-1)== '>' ) {
    						String str = toHTML( grappaNexus.lstr[i].substring(1,grappaNexus.lstr[i].length()-1) ); 
    						surrogateLabel.setText( str );
    						surrogateLabel.setSize( surrogateLabel.getPreferredSize() );
    						g2d.translate((int)grappaNexus.lpos[i].x,(int)grappaNexus.lpos[i].y);
    						surrogateLabel.paint( g2d );
    						g2d.translate(-(int)grappaNexus.lpos[i].x,-(int)grappaNexus.lpos[i].y);
    					} else {
    						g2d.drawString(grappaNexus.lstr[i],(int)grappaNexus.lpos[i].x,(int)grappaNexus.lpos[i].y);
    					}
    				}
    			}
    		}

    		{
    			boolean drawEdges = true;
    			//
    			// TODO CHAS TESTING...
    			//
    			if( drawEdges ) {
    				Edge[] edges = subg.edgeElementsAsArray();
    				//
    				// Change the Stroke by the inverse of the scale.
    				//
    				Composite composite = g2d.getComposite();
					Stroke stroke = g2d.getStroke();
    				//
    				// TODO Artifacts should be treated as layers.
    				// Unfortunately not there yet...
    				//
					if( edgeAlpha != 1.0f ) {
						AlphaComposite alpha = AlphaComposite.getInstance(AlphaComposite.SRC_OVER, edgeAlpha ) ;
						g2d.setComposite(alpha);
					}
					
					if( stroke instanceof BasicStroke ) {
						float f = ((BasicStroke)stroke).getLineWidth() ;
						BasicStroke newStroke = new BasicStroke( (float)(f * 1.0/scaleFactor) );
						g2d.setStroke( newStroke ) ;
					}
    				ArrayList<Edge> deferredEdgeLabels = new ArrayList<Edge>(edges.length);
    				for( Edge edge : edges ) {
    					if(edge == null || !edge.reserve()) continue;
    					if((grappaNexus = edge.grappaNexus) != null && edge.visible && !grappaNexus.style.invis && clipper.intersects(grappaNexus.rawBounds2D())) {
    						grappaNexus.drawImage(g2d);
    						if((edge.highlight&DELETION_MASK) == DELETION_MASK) {
    							g2d.setPaint(deletionStyle.line_color);
    							grappaNexus.fill(g2d);
    							if(GrappaStyle.defaultStroke != deletionStyle.stroke) {
    								g2d.setStroke(deletionStyle.stroke);
    								grappaNexus.draw(g2d);
    								g2d.setStroke(GrappaStyle.defaultStroke);
    							} else {
    								grappaNexus.draw(g2d);
    							}
    						} else if((edge.highlight&SELECTION_MASK) == SELECTION_MASK) {
    							g2d.setPaint(selectionStyle.line_color);
    							grappaNexus.fill(g2d);
    							if(GrappaStyle.defaultStroke != selectionStyle.stroke) {
    								g2d.setStroke(selectionStyle.stroke);
    								grappaNexus.draw(g2d);
    								g2d.setStroke(GrappaStyle.defaultStroke);
    							} else {
    								grappaNexus.draw(g2d);
    							}
    						} else {
    							g2d.setPaint(grappaNexus.color);
    							GrappaLine gl = null;
    							if( grappaNexus.shape instanceof GrappaLine ) {
    								//
    								// must be a simple line, otherwise fall back to Shape usage.
    								//
    								gl = (GrappaLine)grappaNexus.shape;
    								GrappaPoint[] pts = gl.getGrappaPoints() ;
    								if( pts.length == 2 && gl.getArrowType()==GrappaLine.NONE_ARROW_EDGE ) {
    									if( GrappaStyle.defaultStroke != grappaNexus.style.stroke ) {
    										g2d.setStroke(grappaNexus.style.stroke);
    										g2d.drawLine( (int)Math.round(pts[0].x),
    												(int)Math.round(pts[0].y),
    												(int)Math.round(pts[1].x),
    												(int)Math.round(pts[1].y) );
    										g2d.setStroke(GrappaStyle.defaultStroke);
    									} else {
    										g2d.drawLine( (int)Math.round(pts[0].x),
    												(int)Math.round(pts[0].y),
    												(int)Math.round(pts[1].x),
    												(int)Math.round(pts[1].y) );
    									}
    								} else {
    									grappaNexus.fill(g2d);
    								}
    							} else {
    								grappaNexus.fill(g2d);
    							}
    							if(gl == null || ( gl.getGrappaPoints().length != 2 || gl.getArrowType() != GrappaLine.NONE_ARROW_EDGE )) {
    								if( GrappaStyle.defaultStroke != grappaNexus.style.stroke) {
    									g2d.setStroke(grappaNexus.style.stroke);
    									grappaNexus.draw(g2d);
    									g2d.setStroke(GrappaStyle.defaultStroke);
    								} else {
    									grappaNexus.draw(g2d);
    								}
    							} else {

    							}
    						}
    						if(grappaNexus.lstr != null && grappaNexus.lstr.length > 0 && edgeLabels) {
    							deferredEdgeLabels.add( edge ) ;
    						}
    					}
    					edge.release();
    				}
    				if( edgeAlpha != 1.0f ) {
    					g2d.setComposite( composite ) ;
    				}
    				//
    				// Now go back and draw Edge Labels...without alpha...
    				//
    				if( deferredEdgeLabels != null ) {
    					for( Edge dEdge : deferredEdgeLabels ) {
    						GrappaNexus gn = dEdge.grappaNexus;
        					if(!dEdge.reserve()) continue;
							g2d.setFont(gn.font);
							g2d.setPaint(gn.font_color);
							for(i = 0; i < gn.lstr.length; i++) {
								if( gn.lstr[i].charAt(0)=='<' &&
										gn.lstr[i].charAt(gn.lstr[i].length()-1)== '>' ) {
									String str = toHTML( gn.lstr[i].substring(1,gn.lstr[i].length()-1) ) ; 
									surrogateLabel.setText( str );
									surrogateLabel.setSize( surrogateLabel.getPreferredSize() );
									g2d.translate((int)gn.lpos[i].x,(int)gn.lpos[i].y);
									surrogateLabel.paint( g2d );
									g2d.translate(-(int)gn.lpos[i].x,-(int)gn.lpos[i].y);
								} else {
									g2d.drawString(gn.lstr[i],(int)gn.lpos[i].x,(int)gn.lpos[i].y);
								}
							}
	    					dEdge.release();
    					}
    				}
    				g2d.setStroke( stroke ) ;
    			}
    		}
    		
    		{
    			boolean drawSubgraphs = true ;
    			//
    			// TODO CHAS TESTING...
    			//
    			if( drawSubgraphs ) {
    				Iterator<Subgraph> enm = subg.subgraphElements();
    				Subgraph subsubg = null;
    				while(enm.hasNext()) {
    					subsubg = (Subgraph)(enm.next());
    					if(subsubg != null) paintSubgraph(g2d, subsubg, clipper, bkgdColor);
    				}
    			}
    		}

    		{

    			boolean drawNodes = true;
    			//
    			// TODO CHAS TESTING...
    			//
    			if( drawNodes ) {
    				Node[] nodes = subg.nodeElementsAsArray();
    				for( Node node : nodes ) {
    					if(node == null || !node.reserve()) continue;
    					if((grappaNexus = node.grappaNexus) != null && node.visible && !grappaNexus.style.invis && clipper.intersects(grappaNexus.rawBounds2D())) {
    						if(grappaNexus.style.filled) {
    							if (grappaNexus.fillcolor != null) {
    								g2d.setPaint(grappaNexus.fillcolor);
    								grappaNexus.fill(g2d);
    								if (grappaNexus.color != null)
    									g2d.setPaint(grappaNexus.color);
    								else
    									g2d.setPaint(grappaNexus.style.line_color);
    							} else {
    								g2d.setPaint(grappaNexus.color);
    								grappaNexus.fill(g2d);
    								g2d.setPaint(grappaNexus.style.line_color);
    							}
    						} else {
    							g2d.setPaint(grappaNexus.color);
    						}
    						grappaNexus.drawImage(g2d);
    						if((node.highlight&DELETION_MASK) == DELETION_MASK) {
    							g2d.setPaint(deletionStyle.line_color);
    							if(GrappaStyle.defaultStroke != deletionStyle.stroke) {
    								g2d.setStroke(deletionStyle.stroke);
    								grappaNexus.draw(g2d);
    								g2d.setStroke(GrappaStyle.defaultStroke);
    							} else {
    								grappaNexus.draw(g2d);
    							}
    						} else if((node.highlight&SELECTION_MASK) == SELECTION_MASK) {
    							g2d.setPaint(selectionStyle.line_color);
    							if(GrappaStyle.defaultStroke != selectionStyle.stroke) {
    								g2d.setStroke(selectionStyle.stroke);
    								grappaNexus.draw(g2d);
    								g2d.setStroke(GrappaStyle.defaultStroke);
    							} else {
    								grappaNexus.draw(g2d);
    							}
    						} else {
    							if(GrappaStyle.defaultStroke != grappaNexus.style.stroke) {
    								g2d.setStroke(grappaNexus.style.stroke);
    								grappaNexus.draw(g2d);
    								g2d.setStroke(GrappaStyle.defaultStroke);
    							} else {
    								grappaNexus.draw(g2d);
    							}
    						}
    						if(grappaNexus.lstr != null && nodeLabels) {
    							g2d.setFont(grappaNexus.font);
    							g2d.setPaint(grappaNexus.font_color);
    							for(i = 0; i < grappaNexus.lstr.length; i++) {
    								if( grappaNexus.lstr[i].charAt(0)=='<' &&
    										grappaNexus.lstr[i].charAt(grappaNexus.lstr[i].length()-1)== '>' ) {
    									String str = toHTML( grappaNexus.lstr[i].substring(1,grappaNexus.lstr[i].length()-1) ); 
    									surrogateLabel.setText( str );
    									surrogateLabel.setSize( surrogateLabel.getPreferredSize() );
    									g2d.translate((int)grappaNexus.lpos[i].x,(int)grappaNexus.lpos[i].y);
    									surrogateLabel.paint( g2d );
    									g2d.translate(-(int)grappaNexus.lpos[i].x,-(int)grappaNexus.lpos[i].y);
    								} else {
    									g2d.drawString(grappaNexus.lstr[i],(int)grappaNexus.lpos[i].x,(int)grappaNexus.lpos[i].y);
    								}
    							}
    						}
    					}
    					node.release();
    				}
    			}
    		}
    	}
    	subg.release();
    }
    
    private String toHTML( String str ) {
    	StringBuilder newStr = new StringBuilder( "<html>"+str+"</html>");
    	newStr = munged(newStr);
    	return newStr.toString() ;
    }
    
    private StringBuilder munged( StringBuilder str ) {
		int idx = 0, eidx;
		int fromIdx = 0 ;
		while( idx >= 0 ) {
			idx = str.indexOf( "<img", fromIdx ) ;
			if( idx < 0 ) {
				idx = str.indexOf( "<IMG", fromIdx ) ;
			}
			if( idx >= 0 ) {
				eidx = str.indexOf( ">", idx+4 ) ;
				String imgTag = str.substring( idx, eidx ) ;
				String newImgTag = fixImgTag( imgTag ) ;
				str.replace( idx, eidx, newImgTag ) ;
				fromIdx = eidx; // don't worry about overlap.
			}
		}
		return str;
	}
	
	private String fixImgTag( String str ) {
		int idx;
		int mark0;
		int mark1;
		idx = str.indexOf( "SRC=" ) ;
		if( idx < 0 ) {
			idx = str.indexOf( "src=" ) ;
		}
		if( idx > 0 ) {
			for( idx = idx+4; str.charAt(idx) != '"'; idx++ ) ;
			mark0 = idx+1;
			for( idx = mark0; str.charAt(idx) != '"'; idx++ ) ;
			mark1 = idx;
			String loc = str.substring(mark0, mark1 ) ;
			URL u ;
			u = getClass().getClassLoader().getResource(loc) ;
			if( u != null ) {
				str = str.substring(0,mark0) + u.toString() + str.substring(mark1) ;
			}
		}
		return str ;
	}

    private Element findContainingElement(Subgraph subg, Point2D pt) {
    	return(findContainingElement(subg, pt, null));
    }

    private Element findContainingElement(Subgraph subg, Point2D pt, Element crnt) {
    	Element elem;
    	Element[] stash = new Element[2];

    	stash[0] = crnt;
    	stash[1] = null;

    	if((elem = reallyFindContainingElement(subg, pt, stash)) == null)
    		elem = stash[1];
    	return(elem);
    }


    private Element reallyFindContainingElement(Subgraph subg, Point2D pt, Element[] stash) {
    	Rectangle2D bb = subg.getBoundingBox();
    	GrappaNexus grappaNexus = null;
    	
    	if(bb.contains(pt)) {
    		if((Grappa.elementSelection&EDGE) == EDGE) {
    			Iterator<Edge> enm = subg.edgeElements();
    			Edge edge;
    			while(enm.hasNext()) {
    				edge = enm.next();
    				if((grappaNexus = edge.grappaNexus) == null || !edge.selectable) continue;
    				if(grappaNexus.rawBounds2D().contains(pt)) {
    					if(grappaNexus.contains(pt.getX(),pt.getY())) {
    						if(stash[0] == null)
    							return((Element)edge);
    						if(stash[1] == null)
    							stash[1] = edge;
    						if(stash[0] == edge)
    							stash[0] = null;
    					}
    				}
    			}
    		}

    		if((Grappa.elementSelection&NODE) == NODE) {
    			Iterator<Node> enm = subg.nodeElements();
    			Node node;
    			while(enm.hasNext()) {
    				node = enm.next();
    				if((grappaNexus = node.grappaNexus) == null || !node.selectable) continue;
    				if(grappaNexus.rawBounds2D().contains(pt)) {
    					if(grappaNexus.contains(pt)) {
    						if(stash[0] == null)
    							return((Element)node);
    						if(stash[1] == null)
    							stash[1] = node;
    						if(stash[0] == node)
    							stash[0] = null;
    					}
    				}
    			}
    		}

    		Element subelem = null;

    		Iterator<Subgraph> enm = subg.subgraphElements();
    		while(enm.hasNext()) {
    			if((subelem = reallyFindContainingElement((enm.next()), pt, stash)) != null && subelem.selectable) {
    				if(stash[0] == null)
    					return(subelem);
    				if(stash[1] == null)
    					stash[1] = subelem;
    				if(stash[0] == subelem)
    					stash[0] = null;
    			}
    		}

    		if((Grappa.elementSelection&SUBGRAPH) == SUBGRAPH && subg.selectable) {
    			if(stash[0] == null)
    				return((Element)subg);
    			if(stash[1] == null)
    				stash[1] = subg;
    			if(stash[0] == subg)
    				stash[0] = null;
    		}
    	}
    	return(null);
    }

    ///////////////////////////////////////////////////////////////////
    //
    // AncestorListener Interface
    //
    ///////////////////////////////////////////////////////////////////

    public void ancestorMoved(AncestorEvent aev) {
	// don't care
    }

    public void ancestorAdded(AncestorEvent aev) {
	graph.addPanel(this);
    }

    public void ancestorRemoved(AncestorEvent aev) {
	graph.removePanel(this);
    }

    ///////////////////////////////////////////////////////////////////
    //
    // ComponentListener Interface
    //
    ///////////////////////////////////////////////////////////////////

    public void componentHidden(ComponentEvent cev) {
	// don't care
    }

    public void componentMoved(ComponentEvent cev) {
	// don't care
    }

    public void componentResized(ComponentEvent cev) {
	// Needed to reset JScrollPane scrollbars, for example
	revalidate();
    }

    public void componentShown(ComponentEvent cev) {
	// don't care
    }

    ///////////////////////////////////////////////////////////////////
    //
    // PopupMenuListener Interface
    //
    ///////////////////////////////////////////////////////////////////

    public void popupMenuCanceled(PopupMenuEvent pmev) {
	// don't care
    }

    public void popupMenuWillBecomeInvisible(PopupMenuEvent pmev) {
	inMenu = false;
    }

    public void popupMenuWillBecomeVisible(PopupMenuEvent pmev) {
    	inMenu = true;
    }

    ///////////////////////////////////////////////////////////////////
    //
    // MouseListener Interface
    //
    ///////////////////////////////////////////////////////////////////

    public void mouseClicked(MouseEvent mev) {
    	if( panMode ) {
    		JViewport vport = getViewPort() ;
    		panPoint = SwingUtilities.convertPoint(this,mev.getPoint(),vport) ;
    	} else {
    		if(inverseTransform == null || grappaListener == null || inMenu) return;
    		Point2D pt = inverseTransform.transform(mev.getPoint(),null);
    		grappaListener.grappaClicked(subgraph, findContainingElement(subgraph,pt, (subgraph.currentSelection != null && subgraph.currentSelection instanceof Element ? ((Element)subgraph.currentSelection) : null)), new GrappaPoint(pt.getX(), pt.getY()), mev.getModifiers(), mev.getClickCount(), this);
    	}
    }

    public void mousePressed(MouseEvent mev) {
    	if( panMode ) {
    		JViewport vport = getViewPort() ;
    		panPoint = SwingUtilities.convertPoint(this,mev.getPoint(),vport) ;
    	} else {
    		if(inverseTransform == null || grappaListener == null || inMenu) return;
    		Point2D pt = inverseTransform.transform(mev.getPoint(),null);
    		outline = null;

    		grappaListener.grappaPressed(subgraph, (pressedElement = findContainingElement(subgraph,pt)), (pressedPoint = new GrappaPoint(pt.getX(), pt.getY())), (pressedModifiers = mev.getModifiers()), this);
    	}
    }

    public void mouseReleased(MouseEvent mev) {
    	if( !panMode ) {
    		if(inverseTransform == null || grappaListener == null || inMenu) return;
    		int modifiers = mev.getModifiers();
    		Point2D pt = inverseTransform.transform(mev.getPoint(),null);
    		GrappaPoint gpt = new GrappaPoint(pt.getX(), pt.getY());
    		grappaListener.grappaReleased(subgraph, findContainingElement(subgraph,pt), gpt, modifiers, pressedElement, pressedPoint, pressedModifiers, outline, this);
    		if((modifiers&java.awt.event.InputEvent.BUTTON1_MASK) != 0 && (modifiers&java.awt.event.InputEvent.BUTTON1_MASK) == modifiers) {
    			if(outline != null) {
    				//System.err.println("saving outline");
    				savedOutline = GrappaSupport.boxFromCorners(outline, pressedPoint.x, pressedPoint.y, gpt.x, gpt.y);
    				outline = null;
    			} else {
    				//System.err.println("clearing outline");
    				savedOutline = null;
    			}
    		}
    	} else {
    		JViewport vport = getViewPort() ;
    		panPoint = SwingUtilities.convertPoint(this,mev.getPoint(),vport) ;
    	}
    }

    public void mouseEntered(MouseEvent mev) {
    	// don't care
    }

    public void mouseExited(MouseEvent mev) {
    	// don't care
    }

    ///////////////////////////////////////////////////////////////////
    //
    // MouseMotionListener Interface
    //
    ///////////////////////////////////////////////////////////////////
    
    private JViewport getViewPort() {
    	Container tprnt = getParent();
		while (tprnt != null && !(tprnt instanceof javax.swing.JViewport)) {
			tprnt = tprnt.getParent();
		}
		return (JViewport) tprnt ;
    }
    private void panView( int dx, int dy ) {
		JViewport vport = getViewPort() ;
    	Rectangle r = (Rectangle) vport.getViewRect() ;
    	r.translate(-dx,-dy);
    	r = SwingUtilities.convertRectangle(vport.getView(), r, vport);
    	vport.scrollRectToVisible(r);
    }

    public void mouseDragged(MouseEvent mev) {
    	if( panMode == true ) {
    		JViewport vport = getViewPort() ;
    		Point panPoint2 = SwingUtilities.convertPoint(this,mev.getPoint(),vport) ;
    		int dx = panPoint2.x - panPoint.x;
    		int dy = panPoint2.y - panPoint.y;
    		panView( dx, dy ) ;
	    	panPoint = panPoint2;
    	} else {
    		if(inverseTransform == null || grappaListener == null || inMenu) return;
    		int modifiers = mev.getModifiers();
    		Point2D pt = inverseTransform.transform(mev.getPoint(),null);
    		GrappaPoint gpt = new GrappaPoint(pt.getX(), pt.getY());
    		grappaListener.grappaDragged(subgraph, gpt, modifiers, pressedElement, pressedPoint, pressedModifiers, outline, this);
    		if((modifiers&java.awt.event.InputEvent.BUTTON1_MASK) != 0 && (modifiers&java.awt.event.InputEvent.BUTTON1_MASK) == modifiers) {
    			outline = GrappaSupport.boxFromCorners(outline, pressedPoint.x, pressedPoint.y, gpt.x, gpt.y);
    		}
    	}
    }

    public void mouseMoved(MouseEvent evt) {
    }

    public void mouseWheelMoved(MouseWheelEvent evt) {
    	double dir = (evt.getWheelRotation()<0?-1.0:1.0) ;
    	double z = dir*(Math.abs(evt.getWheelRotation()*mouseWheelFactor) / 100.0f) ;
    	this.multiplyScaleFactor(1.0+z) ;
    	repaint();
    }

	public void setMouseWheelFactor( double mouseWheelFactor ) {
		this.mouseWheelFactor = mouseWheelFactor ;
	}

	public double getMouseWheelFactor() { return mouseWheelFactor; }
	
	public void setEdgeAlpha( float edgeAlpha ) {
		this.edgeAlpha = edgeAlpha ;
	}
	
	public float getEdgeAlpha() { return edgeAlpha; }
	
	public void setPanMode( boolean panMode ) {
		this.panMode = panMode;
		if( panMode == true ) {
			setCursor( Cursor.getPredefinedCursor(Cursor.MOVE_CURSOR) ) ;
		} else {
			setCursor( Cursor.getDefaultCursor() ) ;
		}
	}
	
	public boolean getPanMode() { return panMode; }
   
    public void run() {
    	Point2D cpt = getCPT();
    	if (cpt != null) {
    		centerPanelAtPoint(cpt);
    	}
    }
    
    private java.util.List<SimplePolygon> xdotExtractDrawAttrShapes( Graph graph ) {
    	ArrayList<SimplePolygon> shapes = new ArrayList<SimplePolygon>() ;
    	Attribute attr = graph.getAttribute( "_draw_" ) ;
    	if( attr != null ) {
    		String str = attr.getStringValue();
    		StringTokenizer st = new StringTokenizer( str, " " ) ;
    		Color lineColor = null ;
    		Color fillColor = null ;
    		while( st.hasMoreTokens() ) {
    			String token = st.nextToken();
    			if( "c".equals(token) ) {
    				String sSomeN = st.nextToken();
    				String sColor = st.nextToken().substring(1);
    				if( sColor.startsWith("#")) {
    					lineColor = Color.decode(sColor) ;
    				} else {
    					lineColor = Color.getColor(sColor) ;
    				}
    			} else if( "C".equals(token) ) {
    				String sSomeN = st.nextToken();
    				String sColor = st.nextToken().substring(1);
    				if( sColor.startsWith("#")) {
    					fillColor = Color.decode(sColor) ;
    				} else {
    					fillColor = Color.getColor(sColor) ;
    				}
    			} else if( "P".equals(token) ) {
    				String sNumberPoints = st.nextToken() ;
    				int np = Integer.valueOf(sNumberPoints) ;
    				SimplePolygon poly = new SimplePolygon() ;
    				String xStr = st.nextToken();
    				String yStr = st.nextToken();
    				double x = Double.valueOf( xStr ) ;
    				double y = Double.valueOf( yStr ) ;
    				poly.moveTo( x, y );
    				for( int i = 1 ; i < np ; i++ ) {
    					xStr = st.nextToken();
    					yStr = st.nextToken();
    					x = Double.valueOf( xStr ) ;
    					y = Double.valueOf( yStr ) ;
    					poly.lineTo(x, y) ;
    				}
    				poly.closePath(); // polygon

    				if( fillColor != null ) {
    					poly.setFillColor( fillColor ) ;
    				}
    				if( lineColor != null ) {
    					poly.setLineColor( lineColor ) ;
    				}
    				shapes.add( poly ) ;
    			}
    		}
    	}
		return shapes;
    }
    
    private void xdotPaintShapes( java.util.List<SimplePolygon> polys, Graphics2D g2d ) {
    	Color oc = g2d.getColor();
    	for( SimplePolygon poly : polys ) {
    		Color fc ;
    		Color lc ;
    		fc = poly.getFillColor() ;
    		if( fc != null ) {
    			g2d.setColor( fc ) ;
    		} else {
    			g2d.setColor( oc ) ;
    		}
    		g2d.fill( poly ) ;
    		
    		lc = poly.getLineColor();
    		if( lc != null ) {
    			if( lc.equals(fc) != true ) {
    				g2d.setColor( lc ) ;
        			g2d.draw( poly ) ;
    			}
    		}
    		g2d.setColor( oc ) ;
    	}
    }
}
